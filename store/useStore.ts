"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';

const syncAPI = async (action: string, payload: any = {}) => {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      cycleData: null,
      expenses: [],
      profile: null,
      theme: 'light',

      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      setupCycle: async (totalIncome, startDate) => {
        set({ cycleData: { totalIncome, startDate } });
        syncAPI('setupCycle', { totalIncome, startDate });
      },
      
      addMoney: (amount) => {
        set((state) => ({
          cycleData: state.cycleData ? { ...state.cycleData, totalIncome: state.cycleData.totalIncome + amount } : null
        }));
        syncAPI('addMoney', { amount });
      },
      
      addExpense: (expense) => {
        const tempId = crypto.randomUUID();
        set((state) => ({
          expenses: [{ ...expense, id: tempId }, ...state.expenses]
        }));
        syncAPI('addExpense', expense).then(res => {
          if (res?.id) {
             set((state) => ({
                expenses: state.expenses.map(e => e.id === tempId ? { ...e, id: res.id } : e)
             }));
          }
        });
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id)
        }));
        syncAPI('deleteExpense', { id });
      },
      
      resetCycle: () => set((state) => ({ ...state, expenses: [] })),

      saveProfile: (profile) => {
        set({ profile });
      },
      
      wipeData: () => {
        set({ cycleData: null, expenses: [], profile: null });
        syncAPI('wipeData');
      },
      
      syncDataFromCloud: async () => {
        try {
          const res = await fetch('/api/sync');
          if (!res.ok) return;
          const text = await res.text();
          if (!text) return;
          
          const data = JSON.parse(text);
          if (data && !data.offline && !data.error && (Array.isArray(data.expenses) || data.cycleData)) {
             set({ 
               cycleData: data.cycleData ?? null, 
               expenses: data.expenses || [] 
             });
          }
        } catch(e) {}
      }
    }),
    {
      name: 'paisaa-storage',
    }
  )
);
