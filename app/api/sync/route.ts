import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const groupId = searchParams.get("groupId");

  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const where: any = groupId ? { groupId } : { user: { email }, groupId: null };

  const [cycleData, expenses] = await Promise.all([
    prisma.cycle.findFirst({ where, orderBy: { createdAt: "desc" } }),
    prisma.expense.findMany({ where, orderBy: { date: "desc" }, take: 50, include: { user: true } }),
  ]);

  return NextResponse.json({
    cycleData,
    expenses: expenses.map(e => ({
      ...e,
      userName: e.user?.name || e.user?.email?.split('@')[0] || "Guest"
    }))
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, groupId, email } = body;
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, name: email.split('@')[0] } });
    }
    const userId = user.id;
    const where: any = groupId ? { groupId } : { userId, groupId: null };

    switch (action) {
      case 'setupCycle':
        await prisma.cycle.upsert({
          where: groupId ? { id: payload.id || "temp", groupId } : { id: payload.id || "temp", userId, groupId: null },
          // Using a simple create/update logic without complex upserts for multi-tenancy issues
          create: { ...payload, id: undefined, userId, groupId },
          update: payload,
        });
        return NextResponse.json({ success: true });

      case 'addExpense':
        const createdExpense = await prisma.expense.create({
          data: { ...payload, id: undefined, userId, groupId },
        });
        return NextResponse.json({ success: true, id: createdExpense.id });

      case 'deleteExpense':
        await prisma.expense.deleteMany({
          where: { id: payload.id, ...where },
        });
        return NextResponse.json({ success: true });

      case 'updateExpense':
        await prisma.expense.updateMany({
          where: { id: payload.id, ...where },
          data: {
            amount: payload.amount,
            category: payload.category,
            subCategory: payload.subCategory,
            label: payload.label,
            note: payload.note,
          },
        });
        return NextResponse.json({ success: true });

      case 'wipeData':
        await prisma.expense.deleteMany({ where });
        await prisma.cycle.deleteMany({ where });
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
