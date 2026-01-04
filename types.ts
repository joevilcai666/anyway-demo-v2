export enum ViewState {
  DASHBOARD = 'dashboard',
  PRODUCTS = 'products',
  ORDERS = 'orders',
  FINANCE = 'finance',
  DEVELOPERS = 'developers',
}

export enum ApiKeyType {
  SDK = 'sdk',
  PAYMENT = 'payment',
}

export enum ApiKeyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface ApiKey {
  id: string;
  name: string;
  token: string; // The full secret (in a real app, front-end might only see this once)
  type: ApiKeyType;
  status: ApiKeyStatus;
  created: string; // ISO Date
  lastUsed: string | null; // ISO Date or null
}

export interface User {
  name: string;
  email: string;
  initials: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl?: string;
}

export interface DailyUsage {
  date: string;
  cost: number;
  tokens: number;
}

// --- Agent Trace Module Types ---

export type DeliveryStatus = 'success' | 'failed' | 'running';

export type StepType = 'llm' | 'tool' | 'system' | 'retrieval';

export interface Step {
  id: string;
  parentId?: string; // For tree structure
  depth: number;     // 0 for root, 1 for child, etc.
  
  name: string;
  type: StepType;
  status: 'success' | 'failed';
  
  // Timing for Waterfall
  startTime: string; // ISO Date
  endTime: string;   // ISO Date
  durationMs: number;
  durationLabel: string; // e.g. "1.2s"
  
  // Metrics
  cost: number;
  tokensTotal?: number;
  tokensIn?: number;
  tokensOut?: number;
  
  // Context
  provider?: string; // e.g. 'openai', 'anthropic'
  model?: string;    // e.g. 'gpt-4o'
  
  // Data
  input?: string;
  output?: string;
  error?: string;
  finishReason?: string; // e.g., 'stop', 'length'
  
  // Meta (Hidden in default view but available)
  spanId?: string;
  traceId?: string;
}

export interface Delivery {
  id: string;
  timestamp: string; // ISO Date
  agentName: string;
  userEmail: string;
  status: DeliveryStatus;
  
  // Aggregates
  stepCount: number;
  totalTokens: number;
  totalCost: number;
  duration: string; // e.g. "4.5s"
  durationMs: number; // For calculation
  
  steps: Step[];
  artifacts?: {
    name: string;
    url: string;
  }[];
}

// --- Product Catalog Types ---

export type ProductStatus = 'draft' | 'published' | 'archived';

export type RevenueModel = 'one_time' | 'subscription' | 'usage_based';

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  status: ProductStatus;
  revenueModel: RevenueModel;
  defaultPrice?: Price;
  createdAt: string;
  updatedAt: string;
  last7dPayments?: number;
}

export interface Price {
  id: string;
  productId: string;
  revenueModel: RevenueModel;
  currency: string;
  isDefault: boolean;
  // One-time
  amount?: number;
  // Subscription
  billingPeriod?: 'monthly' | 'yearly';
  trialPeriodDays?: number;
  // Usage-based
  unitAmount?: number;
  usageUnitName?: string;
  usageUnitDescription?: string;
  minimumCharge?: number;
}

export interface PaymentLink {
  id: string;
  productId: string;
  priceId: string;
  url: string;
  status: 'active' | 'disabled';
  createdAt: string;
  clicks: number;
  leads: number; // Checkout started
  sales: number; // Paid
}