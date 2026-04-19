"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "../store/useStore";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
     setMounted(true);
  }, []);

  useEffect(() => {
     if (mounted) {
       document.documentElement.className = theme;
     }
  }, [theme, mounted]);

  // Prevent flash of wrong theme
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <div className={theme}>{children}</div>;
}
