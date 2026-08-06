"use client";

import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import Onboarding from "../components/Onboarding";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { userEmail } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!userEmail) {
    return <Onboarding />;
  }

  return <>{children}</>;
}
