"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, User, PlusCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { useStore } from '../store/useStore';

export default function SideNav() {
  const pathname = usePathname();
  const { userAvatarUrl, userEmail } = useStore();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Insights', path: '/insights', icon: PieChart },
  ];

  return (
    <nav className="hidden md:flex flex-col w-64 border-r border-[var(--border-primary)] bg-[var(--bg-primary)] h-screen sticky top-0 py-8 px-4 justify-between">
      <div className="space-y-8">
        <div className="px-4 flex items-center gap-3">
          <div className="h-2 w-6 bg-brand-500 rounded-full shadow-[0_0_10px_rgba(var(--brand-500-rgb),0.5)]" />
          <h2 className="text-xl font-black tracking-tighter text-[var(--text-primary)]">Limitr</h2>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all interactive-tap group",
                  isActive 
                    ? "bg-brand-500/10 text-brand-500" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "" : "group-hover:scale-110 transition-transform"} />
                <span className="text-sm font-bold tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <Link
          href="/add"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-[20px] bg-brand-500 text-white font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all interactive-tap"
        >
          <PlusCircle size={20} />
          Log Entry
        </Link>

        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 p-3 rounded-2xl transition-all border",
            pathname === '/profile'
              ? "bg-[var(--bg-secondary)] border-[var(--border-primary)]"
              : "border-transparent hover:bg-[var(--bg-secondary)]"
          )}
        >
          {userAvatarUrl ? (
            <img 
              src={userAvatarUrl} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border border-[var(--border-primary)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + (userEmail || 'User') + '&background=random';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)]">
              <User size={20} />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-[var(--text-primary)] truncate">
              {userEmail?.split('@')[0] || 'Profile'}
            </p>
            <p className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mt-0.5">Settings</p>
          </div>
        </Link>
      </div>
    </nav>
  );
}
