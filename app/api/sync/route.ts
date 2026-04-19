import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cycleData = await prisma.cycle.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({
      cycleData: cycleData ? { totalIncome: cycleData.totalIncome, startDate: cycleData.startDate } : null,
      expenses: expenses.map(e => ({
        id: e.id,
        amount: e.amount,
        category: e.category,
        note: e.note,
        date: e.date.toISOString()
      }))
    });
  } catch (error) {
    console.warn("DB Connection failed, running in local-only mode.");
    return NextResponse.json({ offline: true, expenses: [], cycleData: null });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case 'setupCycle':
        const cycle = await prisma.cycle.upsert({
          where: { id: 'primary' }, // We use a fixed ID for the primary cycle since we only have one user for now
          create: { 
            id: 'primary',
            totalIncome: payload.totalIncome, 
            startDate: payload.startDate 
          },
          update: { 
            totalIncome: payload.totalIncome, 
            startDate: payload.startDate 
          },
        });
        return NextResponse.json(cycle);

      case 'addMoney':
        const updatedCycle = await prisma.cycle.update({
          where: { id: 'primary' },
          data: { totalIncome: { increment: payload.amount } },
        });
        return NextResponse.json(updatedCycle);

      case 'addExpense':
        const expense = await prisma.expense.create({
          data: {
            amount: payload.amount,
            category: payload.category,
            note: payload.note,
            date: new Date(payload.date),
          },
        });
        return NextResponse.json(expense);

      case 'deleteExpense':
        await prisma.expense.delete({
          where: { id: payload.id },
        });
        return NextResponse.json({ success: true });

      case 'wipeData':
        await prisma.expense.deleteMany({});
        await prisma.cycle.deleteMany({});
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API Error (Falling back to success for optimistic UI):", error);
    return NextResponse.json({ success: true, offline: true });
  }
}
