"use client";

import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { User, Trash2, ShieldCheck, ChevronRight, Wallet, Moon, Sun, Monitor, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';

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
    <div className="space-y-10 animate-in fade-in duration-700 slide-in-from-bottom-5">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Profile</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)] font-medium">Manage your financial identity and settings.</p>
      </header>

      <section className="rounded-[32px] border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-2xl font-bold text-brand-500 border border-brand-500/10">
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
                 <button type="submit" className="text-[10px] font-bold uppercase tracking-widest text-brand-500 text-left">Save Changes</button>
               </form>
             ) : (
               <div onClick={() => setIsEditing(true)} className="cursor-pointer">
                  <h2 className="text-xl font-bold text-[var(--text-primary)] truncate">{profile?.name || "App User"}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-1">Tap to edit name</p>
               </div>
             )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] px-1">Settings</h3>
        <div className="rounded-[32px] border border-[var(--border-primary)] bg-[var(--bg-primary)] overflow-hidden shadow-sm">
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center justify-between p-5 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-primary)]"
           >
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-brand-500">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-bold text-[var(--text-primary)]">Display Theme</p>
                    <p className="text-[10px] font-medium text-[var(--text-secondary)] uppercase">Currently {theme} mode</p>
                 </div>
              </div>
              <div className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Toggle</div>
           </button>

           <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-brand-500">
                    <ShieldCheck size={20} />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-bold text-[var(--text-primary)]">System Protection</p>
                    <p className="text-[10px] font-medium text-[var(--text-secondary)] uppercase">Verified Local session</p>
                 </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           </div>
        </div>
      </section>

      {cycleData && (
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] px-1">Quick Actions</h3>
          <form onSubmit={handleTopUp} className="relative">
             <div className="flex items-center bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-[24px] p-2 pl-6 focus-within:ring-4 focus-within:ring-brand-500/5 transition-all shadow-sm">
                <Wallet className="text-[var(--text-secondary)] h-4 w-4 mr-4" />
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Add funds to cycle..."
                  className="flex-1 bg-transparent text-sm font-bold text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]/50"
                />
                <button 
                  type="submit" 
                  className="bg-brand-500 text-white px-6 py-3 rounded-[20px] text-[10px] font-bold uppercase tracking-widest hover:bg-brand-600 transition-all active:scale-95 shadow-md shadow-brand-500/10"
                >
                  Add
                </button>
             </div>
          </form>
        </section>
      )}

      <section className="space-y-4 pb-12">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-500 px-1">Danger Zone</h3>
        <button 
          onClick={() => window.confirm("Are you sure you want to delete ALL data? This cannot be undone.") && wipeData()}
          className="w-full flex items-center justify-between p-5 rounded-[32px] border border-red-100 bg-red-50/10 hover:bg-red-50 transition-colors group"
        >
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                <Trash2 size={18} />
             </div>
             <div className="text-left">
                <p className="text-sm font-bold text-red-900 leading-tight">Wipe Database</p>
                <p className="text-[9px] font-medium text-red-500 uppercase tracking-widest mt-0.5">Destroy all records</p>
             </div>
          </div>
          <ChevronRight size={16} className="text-red-300" />
        </button>
      </section>
    </div>
  );
}
