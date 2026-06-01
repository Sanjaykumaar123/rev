import { create } from 'zustand';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  level: number;
  badges: string[];
  profileInfo?: {
    skills: string[];
    education: string;
    experience: string;
    careerGoal: string;
  };
}

interface AppState {
  user: UserProfile | null;
  token: string | null;
  theme: 'dark' | 'light';
  assistantOpen: boolean;
  apiUrl: string;
  
  // Actions
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateUserStats: (xp: number, level: number, badges: string[]) => void;
  toggleTheme: () => void;
  setAssistantOpen: (open: boolean) => void;
  updateProfileInfo: (profileInfo: NonNullable<UserProfile['profileInfo']>) => void;
}

export const useStore = create<AppState>((set) => {
  // Safe extraction for SSR
  const getInitialToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const getInitialUser = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  };

  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  };

  return {
    user: getInitialUser(),
    token: getInitialToken(),
    theme: getInitialTheme(),
    assistantOpen: false,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',

    login: (user, token) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token });
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    },

    updateUserStats: (xp, level, badges) => {
      set((state) => {
        if (!state.user) return state;
        const updated = { ...state.user, xp, level, badges };
        localStorage.setItem('user', JSON.stringify(updated));
        return { user: updated };
      });
    },

    toggleTheme: () => {
      set((state) => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', nextTheme);
        const root = window.document.documentElement;
        if (nextTheme === 'light') {
          root.classList.remove('dark');
          root.classList.add('light');
        } else {
          root.classList.remove('light');
          root.classList.add('dark');
        }
        return { theme: nextTheme };
      });
    },

    setAssistantOpen: (open) => set({ assistantOpen: open }),

    updateProfileInfo: (profileInfo) => {
      set((state) => {
        if (!state.user) return state;
        const updated = { ...state.user, profileInfo };
        localStorage.setItem('user', JSON.stringify(updated));
        return { user: updated };
      });
    }
  };
});
