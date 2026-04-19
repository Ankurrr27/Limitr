"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PieChart as PieChartIcon, Trash2, LayoutDashboard, PlusCircle } from "lucide-react";
import { useStore } from "../store/useStore";
import { calculateBudget } from "../utils/budget";
import { cn } from "../utils/cn";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { cycleData, expenses, setupCycle, deleteExpense } = useStore();
  const [income, setIncome] = useState("");
  const [startDay, setStartDay] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const budget = useMemo(() => {
    if (!cycleData) return null;
    return calculateBudget(cycleData.totalIncome, cycleData.startDate, expenses);
  }, [cycleData, expenses]);

  const handleDelete = (id: string) => {
    if (window.confirm("Delete transaction?")) {
      deleteExpense(id);
    }
  };

  if (!mounted) return null;

  if (!cycleData) {
    const handleSetup = (e: React.FormEvent) => {
      e.preventDefault();
      const parsedIncome = Number(income);
      const parsedStartDay = Number(startDay);

      if (!parsedIncome || parsedIncome <= 0 || !parsedStartDay || parsedStartDay < 1 || parsedStartDay > 31) {
        return;
      }
      setupCycle(parsedIncome, parsedStartDay);
    };

    return (
      <div className="flex min-h-[calc(100vh-14rem)] flex-col justify-center animate-in fade-in duration-1000 slide-in-from-bottom-5">
        <section className="mb-10">
          <div className="mb-6 h-1 w-10 bg-brand-500 rounded-full" />
          <h1 className="text-5xl font-extrabold tracking-tighter text-[var(--text-primary)] leading-[0.85]">
             LIMITR.
          </h1>
          <p className="mt-6 text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
             A professional-grade spending companion for intentional capital management.
          </p>
        </section>

        <form onSubmit={handleSetup} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] px-1">Planned Budget (₹)</label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="0"
                className="w-full rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-5 py-4 text-2xl font-bold text-[var(--text-primary)] outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 placeholder:text-[var(--text-secondary)]/30"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] px-1">Cycle Reset Day</label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max="31"
                value={startDay}
                onChange={(e) => setStartDay(e.target.value)}
                placeholder="Day of Month"
                className="w-full rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-5 py-4 text-2xl font-bold text-[var(--text-primary)] outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 placeholder:text-[var(--text-secondary)]/30"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-brand-500 py-5 text-sm font-bold text-white transition-all shadow-lg shadow-brand-500/20 hover:bg-brand-600 active:scale-[0.98]"
          >
            Initialize Limitr
          </button>
        </form>
      </div>
    );
  }

  if (!budget) return null;

  return (
    <div className="space-y-7 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
             <LayoutDashboard size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--text-primary)] leading-none">Limitr</h1>
            <p className="mt-1 text-[9px] font-bold text-accent-emerald uppercase tracking-widest">Active Shell</p>
          </div>
        </div>
        <Link href="/add" className="h-10 w-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 active:scale-90 transition-transform">
           <PlusCircle size={20} />
        </Link>
      </header>

      <section className="relative">
        <div className="rounded-[32px] border border-[var(--border-primary)] bg-[var(--bg-primary)] p-7 shadow-sm flex flex-col items-center justify-center text-center overflow-hidden">
           <div className="absolute top-0 right-0 h-24 w-24 bg-brand-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
           <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-5">Today's Allowance</p>
           
           <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-bold text-[var(--text-secondary)]">₹</span>
              <span className={cn(
                "text-6xl font-extrabold tracking-tighter leading-none transition-colors",
                budget.dailyLimit > 0 ? "text-[var(--text-primary)]" : "text-red-500"
              )}>
                {formatCurrency(Math.max(0, budget.dailyLimit))}
              </span>
           </div>

           <div className="mt-8 flex items-center gap-2 rounded-full bg-[var(--bg-secondary)] px-4 py-1.5 border border-[var(--border-primary)]">
              <div className={cn("h-1.5 w-1.5 rounded-full", budget.isOverspendingEarly ? "bg-amber-500" : "bg-accent-emerald")} />
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                {budget.isOverspendingEarly ? "Caution: High Usage" : "Pacing: Optimal"}
              </span>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3.5">
        <div className="rounded-[28px] border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5">
          <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1.5 text-center">Remaining Balance</p>
          <p className={cn("text-lg font-bold text-center tracking-tight", budget.remainingValue > 0 ? "text-[var(--text-primary)]" : "text-red-500")}>
            ₹{formatCurrency(budget.remainingValue)}
          </p>
        </div>
        <div className="rounded-[28px] border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 text-center">
          <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1.5">Cycle Horizon</p>
          <p className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{budget.remainingDays} Days Left</p>
        </div>
      </div>

      <section className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Recent Activity</h3>
          <Link href="/insights" className="text-[9px] font-bold uppercase tracking-widest text-brand-500 hover:text-brand-600 flex items-center gap-1">
            DETAILS <PieChartIcon size={11} />
          </Link>
        </div>

        {budget.currentCycleExpenses.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center border border-dashed border-[var(--border-primary)] rounded-[32px] bg-[var(--bg-secondary)]">
             <PieChartIcon className="h-7 w-7 text-[var(--text-secondary)]/30 mb-3" />
             <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Awaiting activity...</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {budget.currentCycleExpenses.slice(0, 5).map((expense, idx) => (
              <div 
                key={expense.id} 
                className="group flex items-center justify-between p-3.5 rounded-[24px] border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-sm transition-all hover:bg-[var(--bg-secondary)] animate-in slide-in-from-bottom-2"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-xl shrink-0">
                    {expense.category === 'Food' ? '🍱' : expense.category === 'Travel' ? '🚙' : expense.category === 'Shopping' ? '🛍️' : expense.category === 'Coffee' ? '☕' : expense.category === 'Bills' ? '🧾' : '💎'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-[var(--text-primary)] truncate leading-tight">{expense.category}</h4>
                    <p className="text-[9px] font-medium text-[var(--text-secondary)] truncate">
                      {expense.note || "System Log"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 shrink-0">
                   <p className="text-[13px] font-extrabold text-[var(--text-primary)] leading-none">-{expense.amount}</p>
                   <button 
                    onClick={() => handleDelete(expense.id)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-500/0 text-[var(--text-secondary)] hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                   >
                    <Trash2 size={13} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
