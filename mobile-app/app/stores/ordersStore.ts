// Orders Store - Zustand
import { create } from 'zustand';
import { Order, SortConfig, Filters } from '../types';
import { mockOrders } from '../data/mockData';

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  sortConfig: SortConfig | null;
  filters: Filters;
  loading: boolean;
  error: string | null;

  // Actions
  fetchOrders: () => Promise<void>;
  selectOrder: (order: Order | null) => void;
  sortOrders: (key: string) => void;
  applyFilters: (filters: Partial<Filters>) => void;
  exportOrdersCSV: () => Promise<string>;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: mockOrders,
  selectedOrder: null,
  sortConfig: null,
  filters: {},
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ orders: mockOrders, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch orders', loading: false });
    }
  },

  selectOrder: (order: Order | null) => {
    set({ selectedOrder: order });
  },

  sortOrders: (key: string) => {
    const currentOrder = get().sortConfig?.order === 'asc' ? 'desc' : 'asc';
    const sortConfig: SortConfig = { key, order: currentOrder };

    const sortedOrders = [...get().orders].sort((a, b) => {
      let comparison = 0;
      if (a[key as keyof Order] < b[key as keyof Order]) comparison = -1;
      if (a[key as keyof Order] > b[key as keyof Order]) comparison = 1;
      return currentOrder === 'asc' ? comparison : -comparison;
    });

    set({ orders: sortedOrders, sortConfig });
  },

  applyFilters: (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...get().filters, ...newFilters };
    set({ filters: updatedFilters });

    // Apply filters
    let filteredOrders = mockOrders;

    if (updatedFilters.status && updatedFilters.status.length > 0) {
      filteredOrders = filteredOrders.filter(order =>
        updatedFilters.status!.includes(order.status)
      );
    }

    if (updatedFilters.productIds && updatedFilters.productIds.length > 0) {
      filteredOrders = filteredOrders.filter(order =>
        updatedFilters.productIds!.includes(order.productId)
      );
    }

    if (updatedFilters.searchQuery) {
      const query = updatedFilters.searchQuery.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.productName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query)
      );
    }

    set({ orders: filteredOrders });
  },

  exportOrdersCSV: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate CSV generation
      await new Promise(resolve => setTimeout(resolve, 500));
      const headers = ['Order ID', 'Product', 'Customer Email', 'Amount', 'Status', 'Created At'];
      const rows = get().orders.map(order => [
        order.id,
        order.productName,
        order.customerEmail,
        order.amount.toString(),
        order.status,
        order.createdAt,
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      set({ loading: false });
      return csvContent;
    } catch (error) {
      set({ error: 'Failed to export orders', loading: false });
      throw error;
    }
  },
}));
