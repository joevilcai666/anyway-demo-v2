// Developer Store - Zustand
import { create } from 'zustand';
import { APIKey, UsageStats } from '../types';
import { mockAPIKeys, mockUsageStats } from '../data/mockData';

interface DeveloperState {
  apiKeys: APIKey[];
  usageStats: UsageStats;
  loading: boolean;
  error: string | null;

  // Actions
  fetchAPIKeys: () => Promise<void>;
  fetchUsageStats: () => Promise<void>;
  createAPIKey: (name: string) => Promise<APIKey>;
  revokeAPIKey: (keyId: string) => Promise<void>;
  rotateAPIKey: (keyId: string) => Promise<void>;
}

export const useDeveloperStore = create<DeveloperState>((set, get) => ({
  apiKeys: mockAPIKeys,
  usageStats: mockUsageStats,
  loading: false,
  error: null,

  fetchAPIKeys: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ apiKeys: mockAPIKeys, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch API keys', loading: false });
    }
  },

  fetchUsageStats: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ usageStats: mockUsageStats, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch usage stats', loading: false });
    }
  },

  createAPIKey: async (name: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newKey: APIKey = {
        id: `key-${Date.now()}`,
        name,
        keyPrefix: 'sk_live_',
        key: `sk_live_${Math.random().toString(36).substring(7)}...[hidden]`,
        status: 'active',
        createdAt: new Date().toISOString(),
        usageCount: 0,
      };
      set({ apiKeys: [...get().apiKeys, newKey], loading: false });
      return newKey;
    } catch (error) {
      set({ error: 'Failed to create API key', loading: false });
      throw error;
    }
  },

  revokeAPIKey: async (keyId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({
        apiKeys: get().apiKeys.map(key =>
          key.id === keyId ? { ...key, status: 'revoked' as const } : key
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to revoke API key', loading: false });
    }
  },

  rotateAPIKey: async (keyId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({
        apiKeys: get().apiKeys.map(key =>
          key.id === keyId
            ? { ...key, key: `sk_live_${Math.random().toString(36).substring(7)}...[hidden]` }
            : key
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to rotate API key', loading: false });
    }
  },
}));
