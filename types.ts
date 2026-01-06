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

// --- Order & Payments Module Types ---

export type OrderStatus = 'paid' | 'failed' | 'refunded' | 'partially_refunded' | 'pending';

export interface Order {
  id: string;
  merchantId: string;
  productId?: string;
  productName?: string; // Denormalized for display
  customerEmail: string;
  customerExternalId?: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string; // ISO Date
  
  // Stripe Context
  stripeObject: 'payment_intent' | 'charge' | 'checkout_session' | 'invoice';
  stripeObjectId: string;
  stripeDashboardUrl: string;
  
  // Details
  paymentMethod?: {
    type: string; // 'card'
    brand: string; // 'visa', 'mastercard'
    last4: string;
    expMonth: number;
    expYear: number;
    country: string;
    cvcCheck: 'pass' | 'fail' | 'unavailable';
    zipCheck: 'pass' | 'fail' | 'unavailable';
    ownerName?: string;
    ownerEmail?: string;
    billingAddress?: string;
  };
  
  fees?: {
    processing: number;
    net: number;
  };

  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  type: 'payment_started' | 'payment_authorized' | 'payment_captured' | 'payment_failed' | 'refund_created';
  timestamp: string;
  description?: string;
}

// --- Finance & Connect Module Types ---

export type ConnectStatusType = 'not_connected' | 'restricted' | 'enabled';

export interface ConnectStatus {
  merchantId: string;
  stripeAccountId?: string;
  status: ConnectStatusType;
  disabledReason?: string;
  requirementsDue?: string[];
}

export interface Balance {
  currency: string;
  availableAmount: number;
  onTheWayAmount: number;
  updatedAt: string;
}

export type PayoutStatus = 'paid' | 'pending' | 'in_transit' | 'failed' | 'canceled';

export interface Payout {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  arrivalDate?: string;
  destinationDisplay?: string;
  stripePayoutId: string;
  stripeDashboardUrl?: string;
  createdAt: string;
  failureReason?: string;
  internalNote?: string;
  statementDescriptor?: string;
}

export interface BalanceActivity {
  id: string;
  merchantId: string;
  type: 'payment' | 'payout' | 'refund' | 'fee' | 'adjustment';
  amount: number;
  currency: string;
  fees?: number;
  netAmount?: number;
  description?: string;
  createdAt: string;
  availableOn?: string;
}