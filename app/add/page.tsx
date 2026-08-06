"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Brain } from "lucide-react";
import { useStore } from "../../store/useStore";
import { cn } from "../../utils/cn";

const LABELS = [
  { name: "Need", color: "bg-accent-success", text: "text-emerald-500", desc: "Essential Survival" },
  { name: "Want", color: "bg-brand-500", text: "text-indigo-500", desc: "Joy & Comfort" },
  { name: "Waste", color: "bg-accent-danger", text: "text-red-500", desc: "💀 Instant Regret" },
];

export default function AddExpensePage() {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("Need");
  const [note, setNote] = useState("");
  
  const addExpense = useStore((state) => state.addExpense);
  const cycleData = useStore((state) => state.cycleData);
  const categories = useStore((state) => state.categories);
  const router = useRouter();

  const [category, setCategory] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set default category from store once categories are available
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  if (!mounted) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!cycleData || !parsedAmount || parsedAmount <= 0) return;

    addExpense({
      amount: parsedAmount,
      category,
      label,
      note: note.trim(),
      date: new Date().toISOString(),
    });

    router.push("/");
  };

  if (!cycleData) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center text-center animate-in fade-in duration-500 min-h-[60vh] px-4">
        <div className="h-16 w-16 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mb-6">
          <Brain size={32} />
        </div>
        <h2 className="text-xl font-black text-[var(--text-primary)] mb-2 tracking-tight">Engine Offline</h2>
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-8 max-w-[250px]">
          You need to initialize your operational budget before logging transactions.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-brand-500 text-white font-black text-xs uppercase tracking-widest py-4 px-8 rounded-2xl shadow-xl shadow-brand-500/20 active:scale-[0.98] transition-all hover:bg-brand-600 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/')}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] interactive-tap hover:bg-[var(--bg-primary)] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Log Engine</h1>
      </header>

      <form onSubmit={handleAdd} className="flex flex-col gap-6">
        {/* Amount Input */}
        <div className="space-y-1.5 text-center mt-4">
           <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Amount (₹)</label>
           <div className="relative py-4 flex flex-col items-center justify-center">
             <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              autoFocus
              className="w-full bg-transparent text-6xl font-black tracking-tighter text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]/30 text-center"
              required
            />
           </div>
        </div>

        {/* Reality Check - Smart Labels */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
             <Brain size={14} className="text-brand-500" />
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Reality Check</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {LABELS.map((lb) => (
              <button
                type="button"
                key={lb.name}
                onClick={() => setLabel(lb.name)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-[20px] border transition-all interactive-tap",
                  label === lb.name 
                    ? `border-current ${lb.text} bg-current/5 shadow-inner` 
                    : "border-[var(--border-primary)] bg-[var(--bg-secondary)] opacity-40 grayscale hover:opacity-70"
                )}
              >
                <span className="text-[10px] font-black uppercase tracking-tighter">{lb.name}</span>
                <span className="text-[8px] font-bold opacity-60 text-center leading-tight hidden sm:block">{lb.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories from Store */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Category & Intent</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.name)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all interactive-tap",
                    !isSelected && "opacity-50 hover:opacity-100"
                  )}
                  style={isSelected ? {
                    backgroundColor: cat.color + "15",
                    color: "var(--text-primary)",
                  } : undefined}
                >
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-xl shadow-inner border border-white/5" style={{ backgroundColor: cat.color + "20" }}>
                    {cat.emoji}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider truncate text-center w-full">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Context Note</h3>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this for?"
            className="w-full bg-transparent border-b border-[var(--border-primary)] py-3 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-brand-500 transition-colors placeholder:text-[var(--text-secondary)]/50"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-brand-500 py-4 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all hover:bg-brand-600"
        >
          Commit Transaction
        </button>
      </form>
    </div>
  );
}
