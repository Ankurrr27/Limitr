"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useStore } from "../../store/useStore";
import { calculateBudget } from "../../utils/budget";
import { IndianRupee, PieChart as PieChartIcon, TrendingUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "../../utils/cn";

const COLORS = ["#8b5cf6", "#10b981", "#38bdf8", "#f59e0b", "#a1a1aa", "#6366f1"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false);
  const { cycleData, expenses } = useStore();
  const router = useRouter();

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
    <div className="space-y-10 animate-in fade-in duration-700 slide-in-from-bottom-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Metric Intelligence</p>
          <h1 className="text-3xl font-black tracking-tight text-white mt-1">ANALYTICS</h1>
        </div>
      </header>

      {budget.currentCycleExpenses.length === 0 ? (
        <div className="py-24 border border-zinc-900 rounded-[48px] flex flex-col items-center justify-center text-center">
          <PieChartIcon className="h-12 w-12 text-zinc-800 mb-6" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">No Intelligence Data Available</p>
        </div>
      ) : (
        <div className="space-y-10">
          <section>
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 px-1 mb-6">Distribution Matrix</h3>
             <div className="relative rounded-[48px] border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-3xl overflow-hidden aspect-square">
                <div className="absolute top-0 right-0 h-24 w-24 bg-brand-500/10 blur-3xl opacity-50" />
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="90%"
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={12} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-2xl border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur-3xl">
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{payload[0].name}</p>
                              <p className="text-sm font-black text-white">{formatCurrency(Number(payload[0].value))}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Spent</p>
                   <p className="text-2xl font-black text-white">{formatCurrency(budget.totalSpent)}</p>
                </div>
             </div>
          </section>

          <section className="space-y-4 pb-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 px-1">Resource allocation</h3>
            <div className="space-y-3">
              {categoryData.map((cat, index) => {
                const percentage = Math.round((cat.value / budget.totalSpent) * 100);

                return (
                  <div key={cat.name} className="flex items-center justify-between p-4 rounded-[32px] border border-white/[0.04] bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                      <div className="h-4 w-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-wider">{cat.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                           <div className="w-24 h-1 bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-white transition-all duration-1000" 
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: COLORS[index % COLORS.length]
                                }} 
                              />
                           </div>
                           <span className="text-[9px] font-black text-zinc-600 italic">{percentage}%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-black text-white">{formatCurrency(cat.value)}</p>
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
