"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Trash2, PlusCircle, X, Brain } from "lucide-react";
import { useStore } from "../store/useStore";
import { calculateBudget } from "../utils/budget";
import { cn } from "../utils/cn";
import type { Expense } from "../types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { cycleData, expenses, categories, setupCycle, deleteExpense, updateExpense, activeGroupId, userGroups, setActiveGroup } = useStore();
  const [income, setIncome] = useState("");
  const [startDay, setStartDay] = useState("");
  
  // Edit State
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const budget = useMemo(() => {
    if (!cycleData) return null;
    return calculateBudget(cycleData.totalIncome, cycleData.startDate, expenses);
  }, [cycleData, expenses]);

  // Impulse Alert Logic (3+ expenses in last 2 hours)
  const recentImpulseAlert = useMemo(() => {
     if (!expenses.length) return false;
     const now = new Date();
     const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
     const recentCount = expenses.filter(e => new Date(e.date) > twoHoursAgo).length;
     return recentCount >= 3;
  }, [expenses]);

  // Helpers for category lookup
  const getCategoryColor = (name: string) => {
    const cat = categories.find(c => c.name === name);
    return cat?.color || '#64748b';
  };

  const getCategoryEmoji = (name: string) => {
    const cat = categories.find(c => c.name === name);
    return cat?.emoji || '👻';
  };

  // Sector breakdown data
  const sectorData = useMemo(() => {
    if (!budget) return [];
    const grouped: Record<string, number> = {};
    budget.currentCycleExpenses.forEach(exp => {
      grouped[exp.category] = (grouped[exp.category] || 0) + exp.amount;
    });
    return Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [budget]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete record?")) {
      deleteExpense(id);
      setEditingExpense(null);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      updateExpense(editingExpense.id, {
        amount: Number(editingExpense.amount),
        note: editingExpense.note,
        category: editingExpense.category
      });
      setEditingExpense(null);
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
        <header className="mb-8 pl-1">
          <div className="h-2 w-12 bg-brand-500 rounded-full mb-6 shadow-[0_0_15px_rgba(var(--brand-500-rgb),0.5)]" />
          <h1 className="text-5xl font-black tracking-tighter text-[var(--text-primary)]">Limitr</h1>
          <p className="mt-3 text-[var(--text-secondary)] font-medium text-sm leading-relaxed">Financial Capital Management.<br/>Built for velocity and discipline.</p>
        </header>

        <form onSubmit={handleSetup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] pl-2">Starting Allocation (₹)</label>
            <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[20px] px-5 py-4 text-xl font-bold outline-none focus:border-brand-500 transition-all" placeholder="50000" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] pl-2">Reset Day (1-31)</label>
            <input type="number" min="1" max="31" value={startDay} onChange={(e) => setStartDay(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[20px] px-5 py-4 text-xl font-bold outline-none focus:border-brand-500 transition-all" placeholder="1" required />
          </div>
          <button type="submit" className="w-full bg-brand-500 text-white font-black uppercase tracking-widest py-5 rounded-[20px] shadow-xl shadow-brand-500/20 active:scale-[0.98] transition-all hover:bg-brand-600 mt-4">Initialize Engine</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500 pb-10">
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
           <div className="flex items-center gap-2">
              <div className={cn("h-2.5 w-2.5 rounded-full animate-pulse shadow-lg", activeGroupId ? "bg-emerald-500 shadow-emerald-500/50" : "bg-brand-500 shadow-brand-500/50")} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                Operational Status
              </span>
           </div>
        </div>
        <Link href="/add" className="text-brand-500 interactive-tap bg-brand-500/10 p-2 rounded-full hover:bg-brand-500/20 transition-colors">
           <PlusCircle size={22} strokeWidth={2.5} />
        </Link>
      </header>

      {/* Workspace Picker Capsules */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
         <button 
           onClick={() => setActiveGroup(null)}
           className={cn(
             "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
             activeGroupId === null 
               ? "bg-brand-500 text-white border-transparent shadow-lg shadow-brand-500/20 scale-105" 
               : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--text-primary)]"
           )}
         >
           Personal
         </button>
         {userGroups.map(group => (
           <button 
             key={group.id}
             onClick={() => setActiveGroup(group.id)}
             className={cn(
               "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
               activeGroupId === group.id 
                 ? "bg-emerald-500 text-white border-transparent shadow-lg shadow-emerald-500/20 scale-105" 
                 : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--text-primary)]"
             )}
           >
             {group.name}
           </button>
         ))}
      </div>

      {recentImpulseAlert && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-[20px] p-4 flex items-center gap-4 animate-in slide-in-from-top-2">
           <div className="bg-red-500/20 p-2 rounded-full">
             <Brain size={20} className="text-red-500" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-red-500 leading-normal">
             Velocity Alert: High burn rate detected. Slow down.
           </p>
        </div>
      )}

      {/* Balance Summary for Shared Wallets */}
      {activeGroupId && budget.currentCycleExpenses.length > 0 && (
        <section className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[20px] p-4 shadow-sm animate-in slide-in-from-top-4">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-secondary)]">Settlement Engine</h3>
              <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Syncing</div>
           </div>
           
           {(() => {
              const expenses = budget.currentCycleExpenses;
              const totals: Record<string, number> = {};
              expenses.forEach(e => {
                const name = (e as any).userName || "Guest";
                totals[name] = (totals[name] || 0) + e.amount;
              });
              
              const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);
              const participants = Object.keys(totals);
              const avg = totalSpent / (participants.length || 1);

              return (
                <div className="space-y-4">
                   {participants.map(name => {
                     const diff = totals[name] - avg;
                     const isOwed = diff >= 0;
                     return (
                       <div key={name} className="flex items-center justify-between bg-[var(--bg-primary)] p-2.5 rounded-xl border border-[var(--border-primary)]">
                          <div className="flex items-center gap-2">
                             <div className="h-7 w-7 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-black uppercase">
                               {name.substring(0, 2)}
                             </div>
                             <div>
                               <p className="text-sm font-bold text-[var(--text-primary)]">{name}</p>
                               <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-0.5">Total Logged: ₹{totals[name]}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className={cn(
                               "text-sm font-black tracking-tight",
                               isOwed ? "text-emerald-500" : "text-red-500"
                             )}>
                                {isOwed ? `gets ₹${Math.round(diff)}` : `owes ₹${Math.round(Math.abs(diff))}`}
                             </span>
                             <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-60 mt-0.5">
                               {isOwed ? 'To collect' : 'Needs to pay'}
                             </p>
                          </div>
                       </div>
                     );
                   })}
                   <div className="pt-2">
                     <div className="h-px w-full bg-[var(--border-primary)] mb-3" />
                     <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase text-center tracking-widest space-y-1">
                        <span className="block">Target Average: <span className="text-[var(--text-primary)] font-black">₹{Math.round(avg)}</span> per person</span>
                        <span className="block text-brand-500/70 pt-1">To settle a debt, log it as &quot;Transfer &gt; Settle Up&quot;</span>
                     </p>
                   </div>
                </div>
              );
           })()}
        </section>
      )}

      {/* Main Budget Card */}
      <section className="relative rounded-3xl bg-brand-500 p-6 text-white overflow-hidden shadow-xl shadow-brand-500/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl -mr-20 -mt-20 rounded-full" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-black/10 blur-2xl -ml-14 -mb-14 rounded-full" />
        
        <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-80 relative z-10">Daily Allowance</p>
        <div className="mt-2 flex items-baseline gap-1 relative z-10">
          <span className="text-xl font-bold opacity-70">₹</span>
          <h2 className="text-5xl font-black tracking-tighter drop-shadow-md">
            {formatCurrency(Math.max(0, budget.dailyLimit))}
          </h2>
        </div>
        <div className="mt-5 flex items-center gap-2 relative z-10">
           <div className={cn(
             "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm", 
             budget.isOverspendingEarly ? "bg-red-500 text-white shadow-red-500/50" : "bg-white/20 text-white backdrop-blur-md"
           )}>
              {budget.isOverspendingEarly ? "Caution: High Burn" : "Optimal Pacing"}
           </div>
        </div>
      </section>

      {/* 4-Stat Scorecard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        <div>
          <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest mb-0.5">Total Spent</p>
          <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">₹{formatCurrency(budget.totalSpent)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest mb-0.5">Remaining</p>
          <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">₹{formatCurrency(budget.remainingValue)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest mb-0.5">Days Left</p>
          <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">{budget.remainingDays}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest mb-0.5">Per Day</p>
          <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">₹{formatCurrency(Math.max(0, budget.dailyLimit))}</p>
        </div>
      </div>

      {/* Sector Breakdown */}
      {sectorData.length > 0 && (
        <section className="space-y-4 pt-4 px-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Sector Breakdown</h3>
          <div className="flex flex-col gap-4">
              {sectorData.map((sector) => {
                const color = getCategoryColor(sector.name);
                const percentage = budget.totalSpent > 0 ? Math.round((sector.amount / budget.totalSpent) * 100) : 0;
                return (
                  <div key={sector.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">{sector.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percentage}%`, backgroundColor: color }} />
                      </div>
                      <span className="text-xs font-black text-[var(--text-primary)] tracking-tight w-16 text-right">₹{formatCurrency(sector.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
        </section>
      )}

      {/* Activity Feed */}
      <section className="space-y-2 pt-4 px-2">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Ledger Log</h3>
          <Link href="/insights" className="text-[10px] font-bold tracking-widest text-brand-500 hover:text-brand-600 transition-colors uppercase">View All</Link>
        </div>

        <div className="flex flex-col">
          {budget.currentCycleExpenses.slice(0, 10).map((exp) => {
            const catColor = getCategoryColor(exp.category);
            const catEmoji = getCategoryEmoji(exp.category);

            return (
              <div 
                key={exp.id} 
                onClick={() => setEditingExpense(exp)}
                className="flex items-center justify-between py-3 border-b border-[var(--border-primary)] last:border-0 interactive-tap cursor-pointer hover:bg-[var(--bg-secondary)]/50 transition-colors -mx-2 px-2"
              >
                <div className="flex items-center gap-3">
                  {/* Category Icon with color */}
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center text-lg relative"
                    style={{ backgroundColor: catColor + '15' }}
                  >
                    {catEmoji}
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg-primary)]",
                      exp.label === 'Need' ? 'bg-emerald-500' : exp.label === 'Want' ? 'bg-brand-500' : 'bg-red-500'
                    )} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-bold text-[var(--text-primary)] leading-none">{exp.category}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <p className="text-[10px] font-medium text-[var(--text-secondary)]">{exp.note || "General entry"}</p>
                      {(exp as any).userName && (
                        <span className="text-[9px] font-bold text-brand-500 uppercase tracking-tighter bg-brand-500/10 px-1 rounded">
                          {(exp as any).userName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-center">
                   <p className="font-bold text-sm tracking-tight">-₹{exp.amount}</p>
                   <p className="text-[10px] font-medium text-[var(--text-secondary)] mt-1">
                      {new Date(exp.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
              </div>
            );
          })}
          {budget.currentCycleExpenses.length === 0 && (
            <div className="py-8 text-center border border-dashed border-[var(--border-primary)] rounded-2xl">
               <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">No entries yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal / Slide-up */}
      {editingExpense && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-md p-3 scroll-smooth">
           <div className="w-full max-w-md bg-[var(--bg-primary)] rounded-[28px] p-6 animate-in slide-in-from-bottom-8 duration-300 shadow-2xl border border-[var(--border-primary)]">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black tracking-tight">Edit Entry</h3>
                <button onClick={() => setEditingExpense(null)} className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-primary)] transition-colors">
                   <X size={20} />
                </button>
             </div>

             <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Amount (₹)</label>
                   <input
                    type="number"
                    value={editingExpense.amount}
                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: Number(e.target.value) })}
                    className="w-full bg-[var(--bg-secondary)] rounded-2xl p-4 font-black text-xl outline-none border border-[var(--border-primary)] focus:border-brand-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Note</label>
                   <input
                    type="text"
                    value={editingExpense.note}
                    onChange={(e) => setEditingExpense({ ...editingExpense, note: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] rounded-2xl p-4 font-bold text-sm outline-none border border-[var(--border-primary)] focus:border-brand-500 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                   <button 
                    type="button" 
                    onClick={(e) => handleDelete(editingExpense.id, e as any)}
                    className="flex items-center justify-center gap-2 py-3 rounded-[16px] bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-colors"
                   >
                      <Trash2 size={14} /> Delete
                   </button>
                   <button 
                    type="submit" 
                    className="py-3 rounded-[16px] bg-brand-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
                   >
                      Update
                   </button>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
