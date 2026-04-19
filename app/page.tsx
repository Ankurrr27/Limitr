"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PieChart as PieChartIcon, Trash2, PlusCircle } from "lucide-react";
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
    if (window.confirm("Delete record?")) {
      deleteExpense(id);
    }
  };

  if (!mounted) return null;

  if (!cycleData) {
    const handleSetup = (e: React.FormEvent) => {
      e.preventDefault();
      const parsedIncome = Number(income);
      const parsedStartDay = Number(startDay);
      if (parsedIncome > 0 && parsedStartDay >= 1 && parsedStartDay <= 31) {
        setupCycle(parsedIncome, parsedStartDay);
      }
    };

    return (
      <div className="flex flex-col flex-1 justify-center animate-in fade-in duration-700">
        <header className="mb-8">
          <div className="h-1.5 w-8 bg-brand-500 rounded-full mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            LIMITR
          </h1>
          <p className="mt-2 text-[var(--text-secondary)] font-medium">
            Master your capital with intentionality.
          </p>
        </header>

        <form onSubmit={handleSetup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] pl-1">Starting Allocation (₹)</label>
            <input
              type="number"
              inputMode="numeric"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[16px] px-4 py-3 text-lg font-bold outline-none focus:border-brand-500"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] pl-1">Reset Day</label>
            <input
              type="number"
              min="1" max="31"
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[16px] px-4 py-3 text-lg font-bold outline-none focus:border-brand-500"
              placeholder="1"
              required
            />
          </div>
          <button type="submit" className="w-full bg-brand-500 text-white font-bold py-4 rounded-[16px] shadow-sm active:scale-[0.98] transition-transform">
            Initialize Engine
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-accent-success animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">System Operational</span>
        </div>
        <Link href="/add" className="text-brand-500">
           <PlusCircle size={24} />
        </Link>
      </header>

      {/* Main Budget Card */}
      <section className="relative rounded-[32px] bg-brand-500 p-8 text-white overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Daily Allowance</p>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-bold opacity-70">₹</span>
          <h2 className="text-6xl font-black tracking-tighter">
            {formatCurrency(Math.max(0, budget.dailyLimit))}
          </h2>
        </div>
        <div className="mt-8 flex items-center gap-2">
           <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md", budget.isOverspendingEarly ? "bg-red-500/20 text-red-100" : "bg-white/20 text-white")}>
              {budget.isOverspendingEarly ? "Caution: High Burn" : "Optimal Pacing"}
           </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[24px] p-4">
          <p className="text-[9px] uppercase font-bold text-[var(--text-secondary)] tracking-widest mb-1">Available</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">₹{formatCurrency(budget.remainingValue)}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[24px] p-4 text-right">
          <p className="text-[9px] uppercase font-bold text-[var(--text-secondary)] tracking-widest mb-1">Horizon</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">{budget.remainingDays} Days</p>
        </div>
      </div>

      {/* Activity Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Activity Feed</h3>
          <Link href="/insights" className="text-[10px] font-bold text-brand-500">VIEW ALL</Link>
        </div>

        {budget.currentCycleExpenses.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center border border-dashed border-[var(--border-primary)] rounded-[24px] opacity-60">
             <PieChartIcon size={20} className="mb-2" />
             <p className="text-xs font-medium">Awaiting transactions...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {budget.currentCycleExpenses.slice(0, 5).map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-4 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-[20px] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center text-xl">
                    {exp.category === 'Food' ? '🍱' : exp.category === 'Travel' ? '🚙' : exp.category === 'Shopping' ? '🛍️' : exp.category === 'Coffee' ? '☕' : exp.category === 'Bills' ? '🧾' : '💎'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{exp.category}</p>
                    <p className="text-[10px] font-medium text-[var(--text-secondary)]">{exp.note || "General"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <p className="font-bold text-sm">-{exp.amount}</p>
                   <button onClick={() => handleDelete(exp.id)} className="text-red-500/30 hover:text-red-500 px-1">
                      <Trash2 size={14} />
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
