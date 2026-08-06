"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useStore } from "../../store/useStore";
import { calculateBudget } from "../../utils/budget";
import { PieChart as PieChartIcon } from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false);
  const { cycleData, expenses, categories } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCategoryColor = (name: string) => {
    const cat = categories.find(c => c.name === name);
    return cat?.color || '#64748b';
  };

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
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
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
        <div className="flex flex-col gap-8">
          <section className="relative aspect-square w-full flex flex-col items-center justify-center">
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
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
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
               <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Total Spent</p>
               <p className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">₹{formatCurrency(budget.totalSpent)}</p>
            </div>
          </section>

          <section className="flex flex-col gap-2 pb-10">
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-2">Allocation Details</h3>
            <div className="flex flex-col">
              {categoryData.map((cat) => {
                const percentage = Math.round((cat.value / budget.totalSpent) * 100);
                const color = getCategoryColor(cat.name);
                return (
                  <div key={cat.name} className="flex items-center justify-between py-3 border-b border-[var(--border-primary)] last:border-0 -mx-2 px-2">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wide">{cat.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                           <div className="w-16 h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                              <div 
                                className="h-full transition-all duration-1000" 
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: color
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
