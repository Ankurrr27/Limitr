import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  const { action, name, code, email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    // Auto-ensure user exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, name: email.split('@')[0] } });
    }
    const userId = user.id;

    if (action === "create") {
      const group = await prisma.group.create({
        data: {
          name,
          inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          members: { create: { userId, role: "ADMIN" } },
        },
      });
      return NextResponse.json(group);
    }

    if (action === "join") {
      const group = await prisma.group.findUnique({ where: { inviteCode: code } });
      if (!group) return NextResponse.json({ error: "Invalid code" }, { status: 404 });

      await prisma.groupLink.upsert({
        where: { userId_groupId: { userId, groupId: group.id } },
        create: { userId, groupId: group.id },
        update: { userId, groupId: group.id },
      });
      return NextResponse.json(group);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const groups = await prisma.group.findMany({
    where: { members: { some: { user: { email } } } },
    include: { members: { include: { user: true } } },
  });

  return NextResponse.json(groups);
}
