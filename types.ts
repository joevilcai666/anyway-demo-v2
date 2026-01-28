export enum ViewState {
  EMAIL_INPUT = 'email_input',
  INVITATION_CODE = 'invitation_code',
  SURVEY = 'survey',
  DASHBOARD = 'dashboard',
  PRODUCTS = 'products',
  ORDERS = 'orders',
  FINANCE = 'finance',
  DEVELOPERS = 'developers',
  SUBSCRIPTION = 'subscription',
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
  description?: string;
  token: string; // The full secret (in a real app, front-end might only see this once)
  type: ApiKeyType;
  status: ApiKeyStatus;
  permissions?: ApiKeyPermission[];
  expiresAt?: string | null; // ISO Date or null
  created: string; // ISO Date
  lastUsed: string | null; // ISO Date or null
  usageCount?: number;
}

export type ApiKeyPermission = 'read' | 'write' | 'admin';

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'disabled';
  createdAt: string;
  lastTriggered: string | null;
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

// UPDATE: Product interface (PRD v2.0 - remove defaultPrice)
export interface Product {
  id: string;
  merchantId: string;
  name: string;
  deliverable_description?: string;  // Renamed from 'description'
  status: ProductStatus;
  revenueModel: RevenueModel;
  // REMOVED: defaultPrice?: Price;  // No longer needed in v2.0
  createdAt: string;
  updatedAt: string;
  // REMOVED: last7dPayments?: number;  // Moving to Links list
}

// NEW: Price model (PRD v2.0 - separate from Product)
export interface Price {
  price_id: string;
  product_id: string;
  price_name: string;  // Required: "Basic Tier", "Pro Tier", "Enterprise Plan"
  revenue_model: RevenueModel;
  currency: string;  // Fixed: "USD"
  created_at: string;
  updated_at: string;

  // One-time fields
  unit_amount?: number;  // e.g., 99.99

  // Subscription fields
  billing_period?: 'monthly' | 'yearly';
  trial_period_days?: number;  // Optional, not in MVP

  // Usage-based fields
  usage_unit_name?: string;  // e.g., "API call", "1K tokens", "run"
  usage_unit_description?: string;  // Optional
  minimum_charge?: number;  // Optional, not in MVP
}

// UPDATE: PaymentLink model (PRD v2.0 - add link_name and last_accessed_at)
export interface PaymentLink {
  payment_link_id: string;
  product_id: string;
  price_id: string;  // FK to Price (1:1 relationship)
  link_name: string;  // User-editable: "Basic Tier", "Twitter Campaign"
  url: string;  // Full URL from Stripe/Payment module
  status: 'active' | 'disabled';
  created_at: string;
  last_accessed_at?: string;  // Optional, for analytics
  // REMOVED: clicks, leads, sales (analytics, not in MVP)
}

// NEW: PricingRecommendation model (PRD v2.0)
export interface PricingRecommendation {
  recommendation_id: string;
  snapshot_id: string;  // FK to PricingInputSnapshot (optional for MVP)
  product_id?: string;  // Optional, can be for Price too
  recommended_min_price: number;
  recommended_typical_price: number;
  recommended_max_price: number;
  confidence_level: 'low' | 'medium' | 'high';
  assumptions: Array<{title: string; detail: string}>;
  rationale: Array<{title: string; detail: string}>;
  cost_source: 'trace' | 'manual' | 'none';
  has_cost_data: boolean;
  llm_model: string;  // e.g., "claude-3-5-sonnet"
  prompt_version: string;
  schema_version: string;
  applied_price_type?: 'min' | 'typical' | 'max' | null;
  applied_to_price_id?: string;  // Optional, track which Price
  created_at: string;
}

// NEW: PricingInputSnapshot (PRD v2.0 - optional for MVP)
export interface PricingInputSnapshot {
  snapshot_id: string;
  product_id?: string;
  revenue_model: RevenueModel;
  target_customer_type: 'individual_or_small_team' | 'small_business' | 'growth_enterprise';
  use_case_category: string;
  use_trace_cost_reference: boolean;
  avg_trace_cost?: number;
  manual_cost?: number;
  value_types?: Array<'save_time' | 'increase_revenue' | 'reduce_cost' | 'other'>;
  raw_inputs: Record<string, any>;  // Flexible JSON storage
  created_by?: string;  // user_id
  created_at: string;
}

// NEW: Pricing Assistant State Types (PRD v2.0)
export type PricingAssistantState =
  | 'empty'      // State 1
  | 'form'       // State 2
  | 'advanced'   // State 3
  | 'loading'    // State 4
  | 'success'    // State 5
  | 'error'      // State 6
  | 'no_cost'    // State 7
  | 'out_of_date'; // State 8

export interface PricingAssistantFormData {
  target_customer_type?: 'individual_or_small_team' | 'small_business' | 'growth_enterprise';
  use_case_category?: string;
  use_trace_cost_reference?: boolean;
  manual_cost?: number;
  value_types?: Array<'save_time' | 'increase_revenue' | 'reduce_cost' | 'other'>;
}

export interface PricingAssistantStateData {
  currentState: PricingAssistantState;
  formData: PricingAssistantFormData;
  recommendation?: PricingRecommendation;
  error?: { message: string; details?: string };
  traceCostData?: { has_data: boolean; avg_cost: number; count: number; period_days: number };
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

// --- Onboarding Module Types ---

export type OnboardingStep =
  | 'email_input'
  | 'path_selection'
  | 'invitation_code'
  | 'request_access'
  | 'success';

export type OnboardingPath = 'with_code' | 'request_access';

export interface OnboardingFormData {
  email: string;
  invitationCode?: string;
  fullName?: string;
  companyName?: string;
  useCase?: string;
  source?: string;
}

export interface OnboardingUser {
  id: string;
  email: string;
  fullName?: string;
  invitationCode?: string;
  createdAt: string;
}

// --- Subscription Module Types ---

export type SubscriptionState = 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';

export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface Subscription {
  id: string;
  userId: string;
  planTier: PlanTier;
  state: SubscriptionState;
  currentPeriodStart: string; // ISO Date
  currentPeriodEnd: string; // ISO Date
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  trialEnd?: string; // ISO Date (if trialing)
  cancelAt?: string; // ISO Date (if canceled)
}

export interface Plan {
  tier: PlanTier;
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  limits: {
    computeUnits: number; // Per billing period
    teamMembers: number;
    apiCalls: number; // Per day
  };
  overageRate?: number; // Per unit after limit (for paid plans)
}

export interface Usage {
  currentPeriod: {
    computeUnits: number;
    apiCalls: number;
  };
  predicted: {
    computeUnits: number;
    apiCalls: number;
  };
  percentageUsed: number; // 0-100
  warningThreshold?: number; // 80 or 100
}

export interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  date: string; // ISO Date
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl?: string;
  description?: string; // e.g., "Pro Plan - January 2026"
}

export interface UsageWarning {
  threshold: number; // 80 or 100
  message: string;
  severity: 'warning' | 'critical';
  action?: 'upgrade' | 'view_overage';
}