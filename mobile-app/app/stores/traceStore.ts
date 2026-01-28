// Traces Store - Zustand
import { create } from 'zustand';
import { Trace, Filters } from '../types';
import { mockTraces } from '../data/mockData';

interface TracesState {
  traces: Trace[];
  selectedTrace: Trace | null;
  filters: Filters;
  loading: boolean;
  error: string | null;

  // Actions
  fetchTraces: () => Promise<void>;
  selectTrace: (trace: Trace | null) => void;
  applyFilters: (filters: Partial<Filters>) => void;
  refreshTrace: (traceId: string) => Promise<void>;
}

export const useTracesStore = create<TracesState>((set, get) => ({
  traces: mockTraces,
  selectedTrace: null,
  filters: {},
  loading: false,
  error: null,

  fetchTraces: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ traces: mockTraces, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch traces', loading: false });
    }
  },

  selectTrace: (trace: Trace | null) => {
    set({ selectedTrace: trace });
  },

  applyFilters: (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...get().filters, ...newFilters };
    set({ filters: updatedFilters });

    // Apply filters
    let filteredTraces = mockTraces;

    if (updatedFilters.status && updatedFilters.status.length > 0) {
      filteredTraces = filteredTraces.filter(trace =>
        updatedFilters.status!.includes(trace.status)
      );
    }

    set({ traces: filteredTraces });
  },

  refreshTrace: async (traceId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real app, this would fetch the latest trace data
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to refresh trace', loading: false });
    }
  },
}));
