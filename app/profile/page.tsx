"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../store/useStore';
import { Trash2, ChevronRight, Users, Plus, Mail, CheckCircle, Palette } from 'lucide-react';

export default function ProfilePage() {
  const { userEmail, setUserEmail, userAvatarUrl, setUserAvatarUrl, userGroups, fetchUserGroups, setActiveGroup } = useStore();
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(userEmail || '');
  const [tempAvatarUrl, setTempAvatarUrl] = useState(userAvatarUrl || '');

  // Initialize group list if empty and email exists
  useState(() => {
    if (userEmail !== 'guest@paisaa.com' && userGroups.length === 0) {
      fetchUserGroups();
    }
  });

  const handleGroupAction = async (action: 'create' | 'join') => {
    if (newGroupName === '' && action === 'create') return;
    if (inviteCode === '' && action === 'join') return;

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action, 
          name: newGroupName, 
          code: inviteCode,
          email: userEmail 
        }),
      });
      if (res.ok) {
        setNewGroupName('');
        setInviteCode('');
        fetchUserGroups();
      }
    } catch(e) {
      alert("Database connection is currently offline. You are in local mode.");
    }
  };

  const handleSaveEmail = () => {
    setUserEmail(tempEmail);
    setUserAvatarUrl(tempAvatarUrl);
    setIsEditingEmail(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">Identity</h1>
        <p className="text-[var(--text-secondary)] text-[10px] font-medium uppercase tracking-widest">Digital Footprint Config</p>
      </header>

      {/* Identity Section */}
      <section className="relative p-2">
        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
        <div className="flex items-center gap-4 mb-4">
          <div className="h-14 w-14 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 border border-[var(--border-primary)] overflow-hidden shrink-0">
             {userAvatarUrl ? (
               <img 
                 src={userAvatarUrl} 
                 alt="Profile" 
                 className="w-full h-full object-cover"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + (userEmail || 'User') + '&background=random';
                 }}
               />
             ) : (
               <Mail size={20} />
             )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Active Identity</p>
            {isEditingEmail ? (
              <div className="flex flex-col gap-2 mt-2">
                <input 
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="bg-transparent border-b border-brand-500 text-sm font-black text-[var(--text-primary)] focus:outline-none w-full pb-1"
                  placeholder="Email"
                  autoFocus
                />
                <input 
                  value={tempAvatarUrl}
                  onChange={(e) => setTempAvatarUrl(e.target.value)}
                  className="bg-transparent border-b border-brand-500 text-sm font-medium text-[var(--text-secondary)] focus:outline-none w-full pb-1"
                  placeholder="Avatar URL (Optional)"
                />
                <button onClick={handleSaveEmail} className="text-brand-500 self-end mt-1">
                  <CheckCircle size={20} />
                </button>
              </div>
            ) : (
              <h2 className="text-lg font-black text-[var(--text-primary)] mt-0.5 truncate cursor-pointer hover:text-brand-500 transition-colors" onClick={() => setIsEditingEmail(true)}>
                {userEmail}
              </h2>
            )}
          </div>
        </div>
        <p className="text-[9px] text-[var(--text-secondary)] font-medium leading-relaxed opacity-70">
          Sync data securely across devices by using the same email here. Multi-device tracking ready. Note: A valid MongoDB connection in .env is required.
        </p>
      </section>

      {/* Settings / Preferences */}
      <section className="flex flex-col mt-2">
        <h3 className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-2 mb-2">Preferences</h3>
        <Link href="/categories" className="flex items-center justify-between py-4 border-b border-[var(--border-primary)] interactive-tap group cursor-pointer -mx-2 px-2">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-brand-500">
               <Palette size={14} />
             </div>
             <div>
               <h4 className="text-sm font-bold text-[var(--text-primary)]">Categories</h4>
               <p className="text-[9px] font-medium text-[var(--text-secondary)] mt-0.5">Customize sectors & colors</p>
             </div>
          </div>
          <div className="text-[var(--text-secondary)]">
             <ChevronRight size={16} />
          </div>
        </Link>
      </section>

      {/* Group Management */}
      <section className="flex flex-col mt-4">
        <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Shared Boards</h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase tracking-tighter">
              <Users size={8} /> 
              Multisync Ready
            </div>
        </div>

        <div className="space-y-6 pt-2 px-2">
          {/* Create Group */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase px-1">Host New Board</label>
            <div className="flex gap-2">
              <input 
                placeholder="Ex: Family Hub"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-[16px] px-4 py-3 text-sm font-bold focus:border-brand-500 outline-none transition-all"
              />
              <button 
                onClick={() => handleGroupAction('create')}
                className="bg-brand-500 text-white p-3 rounded-[16px] hover:scale-105 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="h-px bg-[var(--border-primary)] w-full" />

          {/* Join Group */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase px-1">Link Shared Board</label>
            <div className="flex gap-2">
              <input 
                placeholder="6-Digit Invitation Code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="flex-1 bg-transparent border-b border-[var(--border-primary)] py-2 text-sm font-bold focus:border-emerald-500 outline-none transition-all uppercase placeholder:text-[var(--text-secondary)]/50"
              />
              <button 
                onClick={() => handleGroupAction('join')}
                className="text-emerald-500 p-2 hover:scale-105 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Group List */}
      {userGroups.length > 0 && (
        <section className="flex flex-col mt-4">
          <h3 className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-2 mb-1">Active Nodes</h3>
          <div className="flex flex-col">
            {userGroups.map((group) => (
              <div 
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className="flex items-center justify-between py-3 border-b border-[var(--border-primary)] last:border-0 interactive-tap group cursor-pointer -mx-2 px-2"
              >
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] leading-tight">{group.name}</h4>
                  <p className="text-[9px] font-black text-brand-500 mt-1 tracking-widest leading-none">Invite Code: {group.inviteCode}</p>
                </div>
                <div className="text-[var(--text-secondary)]">
                   <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Danger Zone */}
      <section className="mt-4 pt-4 border-t border-[var(--border-primary)]">
         <button onClick={() => {
            if(window.confirm('Clear all local data?')) {
               useStore.getState().wipeData();
               alert("Data Wiped");
            }
         }} className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors px-2 py-4 cursor-pointer w-full text-left">
            <div className="h-10 w-10 rounded-2xl bg-red-500/10 flex items-center justify-center pointer-events-none">
               <Trash2 size={20} />
            </div>
            <span className="text-sm font-black tracking-tight">Purge Local Repository</span>
         </button>
      </section>
    </div>
  );
}
