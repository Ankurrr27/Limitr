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
    <nav className="fixed bottom-0 inset-x-0 h-[64px] mx-auto w-full max-w-md lg:max-w-lg border-t border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-xl z-[100] px-2 flex items-center justify-around pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        
        return (
          <Link
            key={item.name}
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full interactive-tap",
              isActive ? "text-brand-500" : "text-[var(--text-secondary)]"
            )}
          >
            <div className={cn(
              "p-1 rounded-lg transition-colors",
              isActive ? "bg-brand-500/5" : "bg-transparent"
            )}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-semibold tracking-wide uppercase">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
