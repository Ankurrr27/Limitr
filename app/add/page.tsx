"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Keyboard, ArrowLeft } from "lucide-react";
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
    <div className="space-y-10 animate-in fade-in duration-700 slide-in-from-bottom-5">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/')}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Add Transaction</h1>
        <div className="w-10" />
      </header>

      <form onSubmit={handleAdd} className="space-y-10">
        <div className="space-y-4">
           <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] px-1">Transaction Amount (₹)</label>
           <div className="relative rounded-[32px] border border-[var(--border-primary)] bg-[var(--bg-primary)] p-10 flex flex-col items-center justify-center shadow-sm">
             <div className="flex items-center gap-3">
               <span className="text-4xl font-bold text-brand-500">₹</span>
               <input
                type="number"
                inputMode="numeric"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
                className="w-full bg-transparent text-6xl font-bold tracking-tight text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]/20"
                required
              />
             </div>
           </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] px-1">Classification</h3>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.name;

              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={cn(
                    "relative flex items-center gap-4 p-4 rounded-[24px] border transition-all duration-300",
                    isSelected 
                      ? "border-brand-500 bg-brand-500/5 shadow-sm" 
                      : "border-[var(--border-primary)] bg-[var(--bg-primary)] grayscale opacity-60 hover:opacity-100"
                  )}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider transition-all",
                    isSelected ? "text-brand-500" : "text-[var(--text-primary)]"
                  )}>{cat.name}</span>
                  {isSelected && (
                     <div className="ml-auto text-brand-500">
                        <Check size={16} strokeWidth={3} />
                     </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] px-1">Footnote</h3>
          <div className="relative flex items-center">
            <Keyboard className="absolute left-4 text-[var(--text-secondary)] h-4 w-4" />
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Weekly Groceries..."
              className="w-full rounded-[24px] border border-[var(--border-primary)] bg-[var(--bg-primary)] pl-12 pr-4 py-4 text-sm font-bold text-[var(--text-primary)] outline-none transition-all focus:border-brand-500/30 placeholder:text-[var(--text-secondary)]/30 shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-brand-500 py-6 text-white text-sm font-bold uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:bg-brand-600 active:scale-[0.98] transition-all"
        >
          Confirm Transaction
        </button>
      </form>
    </div>
  );
}
