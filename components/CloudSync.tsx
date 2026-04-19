"use client";

import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function CloudSync() {
  const syncDataFromCloud = useStore((state) => state.syncDataFromCloud);

  useEffect(() => {
    syncDataFromCloud();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
