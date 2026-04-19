export interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO string
}

export interface CycleData {
  totalIncome: number;
  startDate: number; // Day of the month (1-31)
}

export interface UserProfile {
  name: string;
  phone: string;
  city?: string;
  monthlyFocus?: string;
}

export interface AppState {
  cycleData: CycleData | null; // null if not setup yet
  expenses: Expense[];
  profile: UserProfile | null;
  theme: 'light' | 'dark';
  
  // Actions
  toggleTheme: () => void;
  setupCycle: (income: number, startDay: number) => void;
  addMoney: (amount: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  resetCycle: () => void;
  wipeData: () => void;
  saveProfile: (profile: UserProfile) => void;
  syncDataFromCloud: () => Promise<void>;
}
