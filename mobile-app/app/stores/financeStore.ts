// Finance Store - Zustand
import { create } from 'zustand';
import { Balance, Transaction } from '../types';
import { mockBalance, mockTransactions } from '../data/mockData';

interface FinanceState {
  balance: Balance;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  withdrawFunds: (amount: number) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  balance: mockBalance,
  transactions: mockTransactions,
  loading: false,
  error: null,

  fetchBalance: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ balance: mockBalance, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch balance', loading: false });
    }
  },

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ transactions: mockTransactions, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch transactions', loading: false });
    }
  },

  withdrawFunds: async (amount: number) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const withdrawal: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'withdrawal',
        amount: -amount,
        currency: 'USD',
        description: 'Withdrawal to bank account',
        status: 'completed',
        createdAt: new Date().toISOString(),
      };
      set({
        transactions: [withdrawal, ...get().transactions],
        balance: {
          ...get().balance,
          available: get().balance.available - amount,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to withdraw funds', loading: false });
    }
  },
}));
