"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useStore } from "../../store/useStore";
import { cn } from "../../utils/cn";

const CATEGORIES = [
  { name: "Food", emoji: "🍱" },
  { name: "Travel", emoji: "🚙" },
  { name: "Shopping", emoji: "🛍️" },
  { name: "Coffee", emoji: "☕" },
  { name: "Bills", emoji: "🧾" },
  { name: "Other", emoji: "💎" },
];

export default function AddExpensePage() {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [note, setNote] = useState("");
  const addExpense = useStore((state) => state.addExpense);
  const cycleData = useStore((state) => state.cycleData);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!cycleData || !parsedAmount || parsedAmount <= 0) return;

    addExpense({
      amount: parsedAmount,
      category,
      note: note.trim(),
      date: new Date().toISOString(),
    });

    router.push("/");
  };

  if (!cycleData) return null;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/')}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] interactive-tap"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold">New Entry</h1>
      </header>

      <form onSubmit={handleAdd} className="flex flex-col gap-8">
        {/* Amount Input */}
        <div className="space-y-2">
           <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Amount (₹)</label>
           <div className="relative rounded-[24px] border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8 flex flex-col items-center justify-center overflow-hidden">
             <div className="flex items-center gap-2 w-full justify-center">
               <span className="text-2xl font-bold text-brand-500 opacity-50">₹</span>
               <input
                type="number"
                inputMode="numeric"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
                className="w-full bg-transparent text-5xl font-black tracking-tighter text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]/10 text-center"
                required
              />
             </div>
           </div>
        </div>

        {/* Classification */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Classification</h3>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={cn(
                    "flex items-center gap-3 p-3.5 rounded-[16px] border transition-all duration-200",
                    isSelected 
                      ? "border-brand-500 bg-brand-500/5 shadow-sm" 
                      : "border-[var(--border-primary)] bg-[var(--bg-primary)] opacity-60"
                  )}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className={cn(
                    "text-[11px] font-bold uppercase tracking-wider",
                    isSelected ? "text-brand-500" : "text-[var(--text-primary)]"
                  )}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Note</h3>
          <div className="relative flex items-center">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Starbucks..."
              className="w-full rounded-[16px] border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-4 text-sm font-bold text-[var(--text-primary)] outline-none transition-all focus:border-brand-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-[16px] bg-brand-500 py-5 text-white text-sm font-bold uppercase tracking-widest shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all"
        >
          Confirm Transaction
        </button>
      </form>
    </div>
  );
}
