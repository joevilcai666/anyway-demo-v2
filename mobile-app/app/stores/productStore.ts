// Products Store - Zustand
import { create } from 'zustand';
import { Product, PaymentLink, PricingRecommendation, PricingInput } from '../types';
import { mockProducts } from '../data/mockData';

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  pricingRecommendation: PricingRecommendation | null;
  loading: boolean;
  error: string | null;
  creatingProduct: boolean;

  // Actions
  fetchProducts: () => Promise<void>;
  selectProduct: (product: Product | null) => void;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  createPaymentLink: (productId: string, linkName: string, priceConfig: any) => Promise<PaymentLink>;
  deletePaymentLink: (linkId: string) => Promise<void>;
  requestPricingRecommendation: (input: PricingInput) => Promise<PricingRecommendation>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: mockProducts,
  selectedProduct: null,
  pricingRecommendation: null,
  loading: false,
  error: null,
  creatingProduct: false,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ products: mockProducts, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products', loading: false });
    }
  },

  selectProduct: (product: Product | null) => {
    set({ selectedProduct: product });
  },

  createProduct: async (productData) => {
    set({ creatingProduct: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set({ products: [...get().products, newProduct], creatingProduct: false });
      return newProduct;
    } catch (error) {
      set({ error: 'Failed to create product', creatingProduct: false });
      throw error;
    }
  },

  updateProduct: async (productId: string, updates: Partial<Product>) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({
        products: get().products.map(product =>
          product.id === productId ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to update product', loading: false });
    }
  },

  deleteProduct: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({
        products: get().products.filter(product => product.id !== productId),
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to delete product', loading: false });
    }
  },

  createPaymentLink: async (productId: string, linkName: string, priceConfig: any) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newLink: PaymentLink = {
        id: `link-${Date.now()}`,
        productId,
        priceId: `price-${Date.now()}`,
        linkName,
        url: `https://anyway.ai/pay/link-${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      set({
        products: get().products.map(product =>
          product.id === productId
            ? { ...product, paymentLinks: [...product.paymentLinks, newLink] }
            : product
        ),
        loading: false,
      });
      return newLink;
    } catch (error) {
      set({ error: 'Failed to create payment link', loading: false });
      throw error;
    }
  },

  deletePaymentLink: async (linkId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({
        products: get().products.map(product => ({
          ...product,
          paymentLinks: product.paymentLinks.filter(link => link.id !== linkId),
        })),
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to delete payment link', loading: false });
    }
  },

  requestPricingRecommendation: async (input: PricingInput) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const recommendation: PricingRecommendation = {
        id: `rec-${Date.now()}`,
        minPrice: input.targetCustomerType === 'individual' ? 29 : input.targetCustomerType === 'small_business' ? 79 : 199,
        typicalPrice: input.targetCustomerType === 'individual' ? 49 : input.targetCustomerType === 'small_business' ? 129 : 299,
        maxPrice: input.targetCustomerType === 'individual' ? 79 : input.targetCustomerType === 'small_business' ? 199 : 499,
        confidenceLevel: input.manualCost ? 'high' : 'medium',
        assumptions: [
          { title: 'Customer Type', detail: `${input.targetCustomerType} segment pricing` },
          { title: 'Use Case', detail: input.useCaseCategory },
        ],
        rationale: [
          { title: 'Market Benchmark', detail: 'Based on 50+ similar products' },
          { title: 'Value Proposition', detail: 'AI-powered solution with clear ROI' },
        ],
        costSource: input.manualCost ? 'manual' : 'none',
        hasCostData: !!input.manualCost,
        createdAt: new Date().toISOString(),
      };
      set({ pricingRecommendation: recommendation, loading: false });
      return recommendation;
    } catch (error) {
      set({ error: 'Failed to get pricing recommendation', loading: false });
      throw error;
    }
  },
}));
