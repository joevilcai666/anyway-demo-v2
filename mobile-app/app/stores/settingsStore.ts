// Settings Store - Zustand
import { create } from 'zustand';
import { User, UserSettings } from '../types';
import { mockUser } from '../data/mockData';

interface SettingsState {
  user: User;
  loading: boolean;
  error: string | null;

  // Actions
  fetchUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  user: mockUser,
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ user: mockUser, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user', loading: false });
    }
  },

  updateUser: async (updates: Partial<User>) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({
        user: { ...get().user, ...updates },
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to update user', loading: false });
    }
  },

  updateSettings: async (settings: Partial<UserSettings>) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({
        user: {
          ...get().user,
          settings: { ...get().user.settings, ...settings },
        },
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to update settings', loading: false });
    }
  },
}));
