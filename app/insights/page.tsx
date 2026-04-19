"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useStore } from "../../store/useStore";
import { calculateBudget } from "../../utils/budget";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#6366f1", "#10b981", "#38bdf8", "#f59e0b", "#a1a1aa", "#ec4899"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false);
  const { cycleData, expenses } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const budget = useMemo(() => {
    if (!cycleData) return null;
    return calculateBudget(cycleData.totalIncome, cycleData.startDate, expenses);
  }, [cycleData, expenses]);

  const categoryData = useMemo(() => {
    if (!budget) return [];

    const grouped = budget.currentCycleExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [budget]);

  if (!mounted || !cycleData || !budget) return null;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)] font-medium">Resource Distribution</p>
      </header>

      {budget.currentCycleExpenses.length === 0 ? (
        <div className="py-24 border border-dashed border-[var(--border-primary)] rounded-[32px] flex flex-col items-center justify-center text-center">
          <PieChartIcon className="h-10 w-10 text-[var(--text-secondary)]/20 mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">No Transactions Recorded</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <section className="relative aspect-square w-full rounded-[40px] border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 shadow-sm flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="90%"
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-2xl bg-[var(--bg-primary)] p-4 shadow-xl border border-[var(--border-primary)]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">{payload[0].name}</p>
                          <p className="text-sm font-bold text-[var(--text-primary)]">₹{formatCurrency(Number(payload[0].value))}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Total Spent</p>
               <p className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">₹{formatCurrency(budget.totalSpent)}</p>
            </div>
          </section>

          <section className="flex flex-col gap-3 pb-10">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Allocation Details</h3>
            {categoryData.map((cat, index) => {
              const percentage = Math.round((cat.value / budget.totalSpent) * 100);
              return (
                <div key={cat.name} className="flex items-center justify-between p-4 rounded-[20px] bg-[var(--bg-primary)] border border-[var(--border-primary)] shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">{cat.name}</p>
                      <div className="mt-2 flex items-center gap-2">
                         <div className="w-20 h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-1000" 
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }} 
                            />
                         </div>
                         <span className="text-[10px] font-bold text-[var(--text-secondary)]">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">₹{formatCurrency(cat.value)}</p>
                </div>
              );
            })}
          </section>
        </div>
      )}
    </div>
  );
}
