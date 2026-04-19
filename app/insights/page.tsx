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
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-5">
      <header className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
           <PieChartIcon size={18} />
        </div>
        <div>
          <h1 className="text-base font-bold text-[var(--text-primary)] leading-none">Analytics</h1>
          <p className="mt-1 text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Resource Matrix</p>
        </div>
      </header>

      {budget.currentCycleExpenses.length === 0 ? (
        <div className="py-24 border border-[var(--border-primary)] rounded-[40px] flex flex-col items-center justify-center text-center bg-[var(--bg-secondary)]">
          <PieChartIcon className="h-10 w-10 text-[var(--text-secondary)]/20 mb-6" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">No Transactions Recorded</p>
        </div>
      ) : (
        <div className="space-y-10">
          <section>
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] px-1 mb-6">Distribution</h3>
             <div className="relative rounded-[40px] border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-sm overflow-hidden aspect-square flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="90%"
                      paddingAngle={5}
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
                            <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4 shadow-xl">
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
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Spent</p>
                   <p className="text-2xl font-bold text-[var(--text-primary)]">₹{formatCurrency(budget.totalSpent)}</p>
                </div>
             </div>
          </section>

          <section className="space-y-4 pb-12">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] px-1">Allocation Details</h3>
            <div className="space-y-3">
              {categoryData.map((cat, index) => {
                const percentage = Math.round((cat.value / budget.totalSpent) * 100);

                return (
                  <div key={cat.name} className="flex items-center justify-between p-4 rounded-[32px] border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-sm">
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
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
