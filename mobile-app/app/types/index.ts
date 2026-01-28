// Type Definitions for Anyway AI MVP

// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  emailAlerts: boolean;
  currency: string;
}

// Product Types
export type RevenueModel = 'one_time' | 'subscription' | 'usage_based';
export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  revenueModel: RevenueModel;
  status: ProductStatus;
  price?: Price;
  paymentLinks: PaymentLink[];
  createdAt: string;
  updatedAt: string;
}

export interface Price {
  id: string;
  productId: string;
  name: string;
  revenueModel: RevenueModel;
  amount: number;
  currency: string;
  billingPeriod?: 'monthly' | 'yearly';
  usageUnitName?: string;
  createdAt: string;
}

export interface PaymentLink {
  id: string;
  productId: string;
  priceId: string;
  linkName: string;
  url: string;
  status: 'active' | 'disabled';
  createdAt: string;
  lastAccessedAt?: string;
}

// Order Types
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  merchantId: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

// Finance Types
export type TransactionType = 'payment' | 'withdrawal' | 'refund' | 'fee';

export interface Balance {
  available: number;
  pending: number;
  currency: string;
  lastUpdatedAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  orderId?: string;
  createdAt: string;
}

// API & Developer Types
export interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  key: string; // Only shown once
  status: 'active' | 'revoked' | 'rotated';
  createdAt: string;
  lastUsedAt?: string;
  usageCount: number;
}

export interface UsageStats {
  apiCalls: number;
  tokens: number;
  cost: number;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
}

// Trace Types
export type TraceStatus = 'success' | 'failed' | 'running';

export interface Trace {
  id: string;
  agentId: string;
  agentName: string;
  status: TraceStatus;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
  };
  response?: {
    statusCode: number;
    headers: Record<string, string>;
    body?: any;
  };
  metrics: TraceMetrics;
  createdAt: string;
  duration: number; // in milliseconds
}

export interface TraceMetrics {
  tokensUsed: number;
  cost: number;
  model: string;
  latency: number;
}

// Pricing Assistant Types
export type CustomerType = 'individual' | 'small_business' | 'enterprise';
export type ValueType = 'save_time' | 'increase_revenue' | 'reduce_cost' | 'other';

export interface PricingInput {
  productId: string;
  targetCustomerType: CustomerType;
  useCaseCategory: string;
  useTraceCostReference: boolean;
  manualCost?: number;
  valueTypes: ValueType[];
}

export interface PricingRecommendation {
  id: string;
  minPrice: number;
  typicalPrice: number;
  maxPrice: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  assumptions: Array<{ title: string; detail: string }>;
  rationale: Array<{ title: string; detail: string }>;
  costSource: 'trace' | 'manual' | 'none';
  hasCostData: boolean;
  createdAt: string;
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  date: string;
}

export interface TimeSeriesData {
  label: string;
  data: ChartDataPoint[];
  color?: string;
}

// Filter Types
export interface DateRange {
  start: string;
  end: string;
}

export interface Filters {
  dateRange?: DateRange;
  status?: string[];
  productIds?: string[];
  searchQuery?: string;
}

// Pagination
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Common Types
export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
}

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  order: SortOrder;
}
