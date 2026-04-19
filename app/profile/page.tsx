"use client";

import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Trash2, ShieldCheck, ChevronRight, Wallet, Moon, Sun } from 'lucide-react';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { profile, cycleData, theme, toggleTheme, saveProfile, addMoney, wipeData } = useStore();
  
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  useEffect(() => {
    setMounted(true);
    if (profile?.name) setName(profile.name);
  }, [profile]);

  if (!mounted) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({ ...profile, name } as any);
    setIsEditing(false);
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount) return;
    addMoney(Number(topUpAmount));
    setTopUpAmount('');
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)] font-medium">Control your experience and identity.</p>
      </header>

      {/* Identity Card */}
      <section className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-brand-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-brand-500/20">
            {profile?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
             {isEditing ? (
               <form onSubmit={handleSaveProfile} className="flex flex-col gap-2">
                 <input
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="bg-transparent text-xl font-bold text-[var(--text-primary)] outline-none border-b-2 border-brand-500 w-full"
                   autoFocus
                 />
                 <button type="submit" className="text-[10px] font-bold uppercase tracking-widest text-brand-500 text-left">Update Entity</button>
               </form>
             ) : (
               <div onClick={() => setIsEditing(true)} className="cursor-pointer">
                  <h2 className="text-xl font-bold text-[var(--text-primary)] truncate">{profile?.name || "Client Engine"}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mt-1">Tap to modify</p>
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Settings Group */}
      <section className="flex flex-col gap-4">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Configuration</h3>
        <div className="overflow-hidden rounded-[24px] border border-[var(--border-primary)] bg-[var(--bg-primary)]">
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center justify-between p-5 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-primary)] interactive-tap"
           >
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-brand-500">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                 </div>
                 <div className="text-left font-bold text-sm">Theme Mode</div>
              </div>
              <div className="text-[10px] font-extrabold text-brand-500 uppercase tracking-widest">{theme}</div>
           </button>

           <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4 opacity-60">
                 <div className="h-10 w-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
                    <ShieldCheck size={18} />
                 </div>
                 <div className="text-left font-bold text-sm">Sandbox Mode</div>
              </div>
              <div className="h-2 w-2 rounded-full bg-accent-success" />
           </div>
        </div>
      </section>

      {/* Wallet Actions */}
      {cycleData && (
        <section className="flex flex-col gap-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Wallet Operations</h3>
          <form onSubmit={handleTopUp} className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[20px] p-2 pl-4">
             <Wallet className="text-[var(--text-secondary)] h-4 w-4 mr-3 opacity-50" />
             <input
               type="number"
               value={topUpAmount}
               onChange={(e) => setTopUpAmount(e.target.value)}
               placeholder="Top-up allocation..."
               className="flex-1 bg-transparent text-sm font-bold text-[var(--text-primary)] outline-none"
             />
             <button 
               type="submit" 
               className="bg-brand-500 text-white px-5 py-2.5 rounded-[14px] text-[10px] font-bold uppercase tracking-widest shadow-md shadow-brand-500/10"
             >
               Add
             </button>
          </form>
        </section>
      )}

      {/* Danger Zone */}
      <section className="flex flex-col gap-4 pb-12">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-red-500 pl-1">Destructive</h3>
        <button 
          onClick={() => window.confirm("Erase all data? This is permanent.") && wipeData()}
          className="w-full flex items-center justify-between p-5 rounded-[24px] border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 transition-colors group"
        >
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
                <Trash2 size={18} />
             </div>
             <p className="text-sm font-bold text-red-600">Purge Database</p>
          </div>
          <ChevronRight size={16} className="text-red-300" />
        </button>
      </section>
    </div>
  );
}
