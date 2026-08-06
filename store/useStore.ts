import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Expense } from '../types';

const DEFAULT_CATEGORIES = [
  { id: 'cat-housing', name: 'Housing', color: '#475569', emoji: '🏠' },
  { id: 'cat-food', name: 'Food', color: '#eab308', emoji: '🍱' },
  { id: 'cat-transport', name: 'Transport', color: '#22c55e', emoji: '🚙' },
  { id: 'cat-utilities', name: 'Utilities', color: '#3b82f6', emoji: '⚡' },
  { id: 'cat-entertainment', name: 'Entertainment', color: '#ef4444', emoji: '🎉' },
  { id: 'cat-shopping', name: 'Shopping', color: '#a855f7', emoji: '🛍️' },
  { id: 'cat-health', name: 'Health', color: '#f97316', emoji: '💊' },
  { id: 'cat-other', name: 'Other', color: '#64748b', emoji: '👻' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      const syncWithCloud = async (action: string, payload: any = {}) => {
        try {
          const email = get().userEmail;
          const groupId = get().activeGroupId;
          const res = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, payload, groupId, email }),
          });
          if (!res.ok) return null;
          return await res.json();
        } catch (e) {
          return null;
        }
      };

      return {
        cycleData: null,
        expenses: [],
        categories: DEFAULT_CATEGORIES,
        profile: null,
        theme: 'dark', // Let's make it dark by default to match Elite vibes
        userEmail: null,
        userAvatarUrl: null,
        userGroups: [],
        activeGroupId: null,

        setUserEmail: (email) => {
          set({ userEmail: email });
          if (email) get().fetchUserGroups();
        },

        setUserAvatarUrl: (url) => {
          set({ userAvatarUrl: url });
        },

        login: (email, avatarUrl) => {
          set({ userEmail: email, userAvatarUrl: avatarUrl || null });
          get().fetchUserGroups();
        },

        setActiveGroup: (id) => {
          set({ activeGroupId: id });
          get().syncDataFromCloud();
        },

        fetchUserGroups: async () => {
          try {
            const res = await fetch(`/api/groups?email=${get().userEmail}`);
            if (res.ok) {
              const data = await res.json();
              set({ userGroups: data });
            }
          } catch (e) {}
        },

        toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        
        setupCycle: async (totalIncome, startDate) => {
          set({ cycleData: { totalIncome, startDate } });
          syncWithCloud('setupCycle', { totalIncome, startDate });
        },
        
        addMoney: (amount) => {
          set((state) => ({
            cycleData: state.cycleData ? { ...state.cycleData, totalIncome: state.cycleData.totalIncome + amount } : null
          }));
          syncWithCloud('addMoney', { amount });
        },
        
        addExpense: (expense) => {
          const tempId = crypto.randomUUID();
          const email = get().userEmail || 'guest@paisaa.com';
          const newExpense = { ...expense, id: tempId, userName: email.split('@')[0] };
          
          set((state) => ({
            expenses: [newExpense as Expense, ...state.expenses]
          }));
          
          syncWithCloud('addExpense', newExpense).then(res => {
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
          syncWithCloud('deleteExpense', { id });
        },

        updateExpense: (id, updates) => {
          set((state) => ({
            expenses: state.expenses.map((e) => e.id === id ? { ...e, ...updates } : e)
          }));
          let updatedExpense = get().expenses.find(e => e.id === id);
          if (updatedExpense) {
            syncWithCloud('updateExpense', updatedExpense);
          }
        },
        
        resetCycle: () => set((state) => ({ ...state, expenses: [] })),

        saveProfile: (profile) => {
          set({ profile });
        },
        
        wipeData: () => {
          set({ cycleData: null, expenses: [], profile: null, userEmail: null, userAvatarUrl: null, activeGroupId: null, userGroups: [] });
          syncWithCloud('wipeData');
        },
        
        syncDataFromCloud: async () => {
          try {
            const email = get().userEmail;
            const groupId = get().activeGroupId;
            const url = groupId ? `/api/sync?groupId=${groupId}&email=${email}` : `/api/sync?email=${email}`;
            const res = await fetch(url);
            if (!res.ok) return;
            
            const data = await res.json();
            if (data && !data.error) {
               set({ 
                 cycleData: data.cycleData ?? get().cycleData, 
                 expenses: data.expenses || get().expenses 
               });
            }
          } catch(e) {}
        },

        // Category Actions
        addCategory: (category) => {
          const newCategory = { ...category, id: `cat-${crypto.randomUUID().slice(0, 8)}` };
          set((state) => ({
            categories: [...state.categories, newCategory]
          }));
        },

        updateCategory: (id, updates) => {
          set((state) => ({
            categories: state.categories.map((c) => c.id === id ? { ...c, ...updates } : c)
          }));
        },

        deleteCategory: (id) => {
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id)
          }));
        },
      };
    },
    {
      name: 'paisaa-storage',
    }
  )
);
