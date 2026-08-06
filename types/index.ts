export interface Category {
  id: string;
  name: string;
  color: string; // hex color like #22c55e
  emoji: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  subCategory?: string;
  label?: string; // Need, Want, Waste
  note: string;
  date: string; // ISO string
  userName?: string;
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

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
}

export interface AppState {
  cycleData: CycleData | null; // null if not setup yet
  expenses: Expense[];
  categories: Category[];
  profile: UserProfile | null;
  theme: 'light' | 'dark';
  
  // New States
  userEmail: string | null;
  userAvatarUrl: string | null;
  setUserEmail: (email: string) => void;
  setUserAvatarUrl: (url: string) => void;
  login: (email: string, avatarUrl?: string) => void;
  userGroups: Group[];
  activeGroupId: string | null;
  setActiveGroup: (id: string | null) => void;
  fetchUserGroups: () => Promise<void>;
  
  // Actions
  toggleTheme: () => void;
  setupCycle: (income: number, startDay: number) => void;
  addMoney: (amount: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  resetCycle: () => void;
  wipeData: () => void;
  saveProfile: (profile: UserProfile) => void;
  syncDataFromCloud: () => Promise<void>;

  // Category Actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;
}
