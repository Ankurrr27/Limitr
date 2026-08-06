"use client";

import { useState } from "react";
import { useStore } from "../store/useStore";
import { ArrowRight, UserCircle } from "lucide-react";
import { cn } from "../utils/cn";

export default function Onboarding() {
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    login(email.trim(), avatarUrl.trim() || undefined);
  };

  return (
    <div className="flex flex-col flex-1 justify-center animate-in fade-in duration-700 max-w-md mx-auto w-full px-5 min-h-screen">
      <header className="mb-10 text-center">
        <div className="h-2 w-12 bg-brand-500 rounded-full mb-6 mx-auto shadow-[0_0_15px_rgba(var(--brand-500-rgb),0.5)]" />
        <h1 className="text-5xl font-black tracking-tighter text-[var(--text-primary)]">Limitr</h1>
        <p className="mt-3 text-[var(--text-secondary)] font-medium text-sm leading-relaxed">
          Identity Authentication Required.<br />Secure your data.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile Preview" 
                className="w-24 h-24 rounded-full object-cover border-4 border-[var(--border-primary)] shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + email + '&background=random';
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] border-4 border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] shadow-lg">
                <UserCircle size={48} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] pl-2">Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[20px] px-5 py-4 text-lg font-bold outline-none focus:border-brand-500 transition-all" 
            placeholder="you@example.com" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] pl-2">Profile Picture URL (Optional)</label>
          <input 
            type="url" 
            value={avatarUrl} 
            onChange={(e) => setAvatarUrl(e.target.value)} 
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[20px] px-5 py-4 text-sm font-medium outline-none focus:border-brand-500 transition-all" 
            placeholder="https://example.com/avatar.jpg" 
          />
        </div>

        <button 
          type="submit" 
          className={cn(
            "w-full py-5 rounded-[20px] font-black uppercase tracking-widest transition-all interactive-tap flex items-center justify-center gap-2 mt-4",
            email.trim()
              ? "bg-brand-500 text-white shadow-xl shadow-brand-500/20 hover:bg-brand-600"
              : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] opacity-50 cursor-not-allowed"
          )}
          disabled={!email.trim()}
        >
          Initialize Profile
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
