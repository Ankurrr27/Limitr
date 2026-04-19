"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, User, PlusCircle } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Add', path: '/add', icon: PlusCircle },
  { name: 'Insights', path: '/insights', icon: PieChart },
  { name: 'Profile', path: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md pointer-events-none">
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent pointer-events-none" />
      <ul className="relative mx-auto flex h-[72px] items-center justify-around border-t border-[var(--border-primary)] bg-[var(--bg-primary)]/90 backdrop-blur-xl pointer-events-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <li key={item.name} className="flex-1 h-full">
              <Link
                href={item.path}
                className={cn(
                  "relative flex h-full w-full flex-col items-center justify-center gap-1 transition-all duration-300",
                  isActive ? "text-brand-500" : "text-[var(--text-secondary)]"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500",
                  isActive ? "bg-brand-500/10" : "bg-transparent"
                )}>
                  <Icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className="transition-all duration-300"
                  />
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-widest transition-all duration-300",
                  isActive ? "opacity-100 scale-100" : "opacity-60 scale-90"
                )}>
                   {item.name}
                </span>
                {isActive && (
                  <div className="absolute top-0 h-[2px] w-6 bg-brand-500 rounded-b-full shadow-[0_2px_8px_rgba(99,102,241,0.4)]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)] bg-[var(--bg-primary)]" />
    </nav>
  );
}
