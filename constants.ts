import {
  ApiKey,
  ApiKeyStatus,
  ApiKeyType,
  Delivery,
  Step,
  Invoice,
  DailyUsage,
  Product,
  Price,
  PaymentLink,
  PricingRecommendation,
  ConnectStatus,
  ConnectStatusType,
  Balance,
  Payout,
  Plan,
  PlanTier,
  Subscription,
  SubscriptionState,
  SubscriptionInvoice,
  Usage,
} from './types';

export const MOCK_USER = {
  name: 'Jichun Cai',
  email: 'jichun@anyway.ai',
  initials: 'JC',
};

export const INITIAL_SDK_KEYS: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Production Agent',
    description: 'Main production API key',
    token: 'sk_live_89234789234h2k34h2k34',
    type: ApiKeyType.SDK,
    status: ApiKeyStatus.ACTIVE,
    permissions: ['read', 'write'],
    expiresAt: null,
    created: '2023-10-24T10:00:00Z',
    lastUsed: '2023-10-25T14:30:00Z',
    usageCount: 1524,
  },
  {
    id: 'key_2',
    name: 'Staging Environment',
    description: 'For testing and development',
    token: 'sk_test_77234789234h2k34h2k34',
    type: ApiKeyType.SDK,
    status: ApiKeyStatus.INACTIVE,
    permissions: ['read', 'write', 'admin'],
    expiresAt: '2024-12-31T23:59:59Z',
    created: '2023-09-15T09:00:00Z',
    lastUsed: null,
    usageCount: 89,
  },
  {
    id: 'key_3',
    name: 'Read-only Client',
    description: 'Read-only access for monitoring',
    token: 'sk_live_555666777888999000111',
    type: ApiKeyType.SDK,
    status: ApiKeyStatus.ACTIVE,
    permissions: ['read'],
    expiresAt: null,
    created: '2024-01-10T08:30:00Z',
    lastUsed: '2024-01-20T09:15:00Z',
    usageCount: 2341,
  },
];

export const INITIAL_WEBHOOKS = [
  {
    id: 'wh_1',
    url: 'https://api.example.com/webhooks/anyway',
    events: ['agent.created', 'agent.completed', 'agent.failed'],
    secret: 'whsec_abc123def456',
    status: 'active',
    createdAt: '2024-01-05T10:00:00Z',
    lastTriggered: '2024-01-25T14:22:00Z',
  },
  {
    id: 'wh_2',
    url: 'https://webhooks.myapp.com/analytics',
    events: ['agent.completed'],
    secret: 'whsec_xyz789uvw012',
    status: 'active',
    createdAt: '2024-01-15T11:30:00Z',
    lastTriggered: '2024-01-26T16:45:00Z',
  },
];

export const INITIAL_PAYMENT_KEYS: ApiKey[] = [];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv_OCT23', date: '2023-10-01', amount: 450.00, status: 'paid' },
  { id: 'inv_SEP23', date: '2023-09-01', amount: 320.50, status: 'paid' },
  { id: 'inv_AUG23', date: '2023-08-01', amount: 150.00, status: 'paid' },
];

export const MOCK_DAILY_USAGE: DailyUsage[] = Array.from({ length: 14 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  return {
    date: date.toISOString(),
    cost: Math.random() * 5 + 10,
    tokens: Math.floor(Math.random() * 1000000)
  };
});

export const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const MASK_CHAR = '*';

// --- Dashboard Mock Data ---

const NOW = new Date().getTime();

const MOCK_STEPS_1: Step[] = [
  {
    id: 's1', depth: 0, name: 'User Input', type: 'system', status: 'success',
    startTime: new Date(NOW - 5000).toISOString(), endTime: new Date(NOW - 4900).toISOString(), durationMs: 100, durationLabel: '0.1s',
    cost: 0, output: 'Research latest AI trends',
    spanId: 'span_01', traceId: 'tr_89234'
  },
  {
    id: 's2', depth: 0, name: 'Orchestrator', type: 'llm', status: 'success',
    startTime: new Date(NOW - 4800).toISOString(), endTime: new Date(NOW - 1000).toISOString(), durationMs: 3800, durationLabel: '3.8s',
    cost: 0.002, provider: 'openai', model: 'gpt-4o',
    tokensTotal: 570, tokensIn: 450, tokensOut: 120, finishReason: 'stop',
    spanId: 'span_02', traceId: 'tr_89234'
  },
  {
    id: 's3', depth: 1, parentId: 's2', name: 'Google Search Tool', type: 'tool', status: 'success',
    startTime: new Date(NOW - 4500).toISOString(), endTime: new Date(NOW - 3500).toISOString(), durationMs: 1000, durationLabel: '1.0s',
    cost: 0.01, input: 'query: "AI trends 2024"',
    provider: 'google', model: 'search-v1',
    spanId: 'span_03', traceId: 'tr_89234'
  },
  {
    id: 's4', depth: 0, name: 'Synthesize & Reply', type: 'llm', status: 'success',
    startTime: new Date(NOW - 900).toISOString(), endTime: new Date(NOW).toISOString(), durationMs: 900, durationLabel: '0.9s',
    cost: 0.005, provider: 'openai', model: 'gpt-4o-mini',
    tokensTotal: 2000, tokensIn: 1200, tokensOut: 800, finishReason: 'stop',
    spanId: 'span_04', traceId: 'tr_89234'
  },
];

export const SAMPLE_DELIVERIES: Delivery[] = [
  {
    id: 'del_89234',
    timestamp: new Date(NOW - 5000).toISOString(),
    agentName: 'Research Assistant',
    userEmail: 'demo@example.com',
    status: 'success',
    stepCount: 4,
    totalTokens: 2570,
    totalCost: 0.017,
    duration: '4.9s',
    durationMs: 4900,
    steps: MOCK_STEPS_1,
    artifacts: [{ name: 'Trend Report.md', url: '#' }]
  },
];

// --- Product Catalog Mock Data (PRD v2.0) ---

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    merchantId: 'merchant_1',
    name: 'Weekly Business Report',
    deliverable_description: 'A weekly report summarizing your key business metrics and insights',
    status: 'published',
    revenueModel: 'subscription',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-13T10:00:00Z',
  },
  {
    id: 'prod_2',
    merchantId: 'merchant_1',
    name: 'Market Analysis Report',
    deliverable_description: 'Comprehensive market research and competitor analysis',
    status: 'published',
    revenueModel: 'one_time',
    createdAt: '2026-01-05T14:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'prod_3',
    merchantId: 'merchant_1',
    name: 'AI Content Generator',
    deliverable_description: 'Generate blog posts, social media content, and marketing copy using AI',
    status: 'published',
    revenueModel: 'subscription',
    createdAt: '2026-01-08T11:00:00Z',
    updatedAt: '2026-01-15T14:00:00Z',
  },
  {
    id: 'prod_4',
    merchantId: 'merchant_1',
    name: 'Customer Support Bot',
    deliverable_description: 'Intelligent customer service automation with natural language understanding',
    status: 'published',
    revenueModel: 'subscription',
    createdAt: '2026-01-12T16:00:00Z',
    updatedAt: '2026-01-18T09:00:00Z',
  },
  {
    id: 'prod_5',
    merchantId: 'merchant_1',
    name: 'Data Analysis Assistant',
    deliverable_description: 'Automated data insights and visualization for business intelligence',
    status: 'draft',
    revenueModel: 'subscription',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-22T15:00:00Z',
  },
  {
    id: 'prod_6',
    merchantId: 'merchant_1',
    name: 'Email Marketing Tool',
    deliverable_description: 'Personalized email campaigns powered by AI segmentation',
    status: 'published',
    revenueModel: 'usage_based',
    createdAt: '2026-01-03T09:00:00Z',
    updatedAt: '2026-01-11T12:00:00Z',
  },
  {
    id: 'prod_7',
    merchantId: 'merchant_1',
    name: 'SEO Optimizer',
    deliverable_description: 'AI-powered SEO analysis and content optimization recommendations',
    status: 'published',
    revenueModel: 'subscription',
    createdAt: '2026-01-07T13:00:00Z',
    updatedAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'prod_8',
    merchantId: 'merchant_1',
    name: 'Social Media Manager',
    deliverable_description: 'Schedule, analyze, and optimize your social media presence',
    status: 'archived',
    revenueModel: 'subscription',
    createdAt: '2025-12-15T08:00:00Z',
    updatedAt: '2026-01-05T14:00:00Z',
  },
  {
    id: 'prod_9',
    merchantId: 'merchant_1',
    name: 'Code Review Assistant',
    deliverable_description: 'Automated code analysis, security checks, and best practice recommendations',
    status: 'published',
    revenueModel: 'subscription',
    createdAt: '2026-01-14T11:00:00Z',
    updatedAt: '2026-01-19T15:00:00Z',
  },
  {
    id: 'prod_10',
    merchantId: 'merchant_1',
    name: 'Project Management AI',
    deliverable_description: 'Smart task allocation, timeline prediction, and resource optimization',
    status: 'draft',
    revenueModel: 'subscription',
    createdAt: '2026-01-21T09:00:00Z',
    updatedAt: '2026-01-23T16:00:00Z',
  },
  {
    id: 'prod_11',
    merchantId: 'merchant_1',
    name: 'Legal Document Assistant',
    deliverable_description: 'Draft and review legal documents with AI-powered compliance checks',
    status: 'published',
    revenueModel: 'subscription',
    createdAt: '2026-01-06T10:00:00Z',
    updatedAt: '2026-01-14T11:00:00Z',
  },
  {
    id: 'prod_12',
    merchantId: 'merchant_1',
    name: 'HR Recruitment Tool',
    deliverable_description: 'AI-powered resume screening and candidate matching',
    status: 'published',
    revenueModel: 'usage_based',
    createdAt: '2026-01-09T14:00:00Z',
    updatedAt: '2026-01-17T13:00:00Z',
  },
];

// --- Product Analytics Mock Data ---

export interface ProductAnalytics {
  productId: string;
  totalRevenue: number;
  subscribers: number;
  monthlyRevenue: number;
  revenueGrowth: number; // percentage
  activeLinks: number;
  totalOrders: number;
}

export const mockProductAnalytics: Record<string, ProductAnalytics> = {
  'prod_1': {
    productId: 'prod_1',
    totalRevenue: 12450,
    subscribers: 142,
    monthlyRevenue: 2850,
    revenueGrowth: 12.5,
    activeLinks: 2,
    totalOrders: 245,
  },
  'prod_2': {
    productId: 'prod_2',
    totalRevenue: 8900,
    subscribers: 0,
    monthlyRevenue: 3200,
    revenueGrowth: 8.2,
    activeLinks: 3,
    totalOrders: 156,
  },
  'prod_3': {
    productId: 'prod_3',
    totalRevenue: 18500,
    subscribers: 289,
    monthlyRevenue: 4100,
    revenueGrowth: 23.1,
    activeLinks: 4,
    totalOrders: 389,
  },
  'prod_4': {
    productId: 'prod_4',
    totalRevenue: 9200,
    subscribers: 97,
    monthlyRevenue: 2100,
    revenueGrowth: 5.8,
    activeLinks: 2,
    totalOrders: 178,
  },
  'prod_5': {
    productId: 'prod_5',
    totalRevenue: 0,
    subscribers: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    activeLinks: 0,
    totalOrders: 0,
  },
  'prod_6': {
    productId: 'prod_6',
    totalRevenue: 15600,
    subscribers: 0,
    monthlyRevenue: 5400,
    revenueGrowth: 18.3,
    activeLinks: 5,
    totalOrders: 423,
  },
  'prod_7': {
    productId: 'prod_7',
    totalRevenue: 6800,
    subscribers: 68,
    monthlyRevenue: 1500,
    revenueGrowth: 9.7,
    activeLinks: 2,
    totalOrders: 134,
  },
  'prod_8': {
    productId: 'prod_8',
    totalRevenue: 2400,
    subscribers: 31,
    monthlyRevenue: 0,
    revenueGrowth: -2.3,
    activeLinks: 1,
    totalOrders: 52,
  },
  'prod_9': {
    productId: 'prod_9',
    totalRevenue: 11200,
    subscribers: 156,
    monthlyRevenue: 3200,
    revenueGrowth: 15.6,
    activeLinks: 3,
    totalOrders: 267,
  },
  'prod_10': {
    productId: 'prod_10',
    totalRevenue: 0,
    subscribers: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    activeLinks: 0,
    totalOrders: 0,
  },
  'prod_11': {
    productId: 'prod_11',
    totalRevenue: 20300,
    subscribers: 234,
    monthlyRevenue: 5600,
    revenueGrowth: 11.2,
    activeLinks: 3,
    totalOrders: 345,
  },
  'prod_12': {
    productId: 'prod_12',
    totalRevenue: 8700,
    subscribers: 0,
    monthlyRevenue: 3100,
    revenueGrowth: 7.4,
    activeLinks: 2,
    totalOrders: 198,
  },
};

export const getProductAnalytics = (productId: string): ProductAnalytics | undefined => {
  return mockProductAnalytics[productId];
};

export const mockPrices: Price[] = [
  {
    price_id: 'price_1',
    product_id: 'prod_1',
    price_name: 'Basic Tier',
    revenue_model: 'subscription',
    currency: 'USD',
    unit_amount: 99,
    billing_period: 'monthly',
    created_at: '2026-01-13T10:00:00Z',
    updated_at: '2026-01-13T10:00:00Z',
  },
  {
    price_id: 'price_2',
    product_id: 'prod_1',
    price_name: 'Pro Tier',
    revenue_model: 'subscription',
    currency: 'USD',
    unit_amount: 199,
    billing_period: 'monthly',
    created_at: '2026-01-13T11:00:00Z',
    updated_at: '2026-01-13T11:00:00Z',
  },
];

export const mockPaymentLinks: PaymentLink[] = [
  {
    payment_link_id: 'link_1',
    product_id: 'prod_1',
    price_id: 'price_1',
    link_name: 'Twitter Campaign',
    url: 'https://pay.anyway.ai/p/abc123',
    status: 'active',
    created_at: '2026-01-13T10:00:00Z',
    last_accessed_at: '2026-01-18T15:30:00Z',
  },
  {
    payment_link_id: 'link_2',
    product_id: 'prod_1',
    price_id: 'price_2',
    link_name: 'Email Promo',
    url: 'https://pay.anyway.ai/p/def456',
    status: 'active',
    created_at: '2026-01-14T09:00:00Z',
    last_accessed_at: '2026-01-17T12:00:00Z',
  },
];

export const mockPricingRecommendations: PricingRecommendation[] = [
  {
    recommendation_id: 'rec_1',
    snapshot_id: 'snap_1',
    product_id: 'prod_1',
    recommended_min_price: 79,
    recommended_typical_price: 99,
    recommended_max_price: 149,
    confidence_level: 'medium',
    assumptions: [
      { title: 'Market benchmarks', detail: 'Based on similar products in the market' },
      { title: 'Cost coverage', detail: 'Prices cover estimated costs with healthy margins' },
    ],
    rationale: [
      { title: 'Min price', detail: 'Covers your costs with 20% margin' },
      { title: 'Typical price', detail: 'Aligns with market median for similar services' },
      { title: 'Max price', detail: 'Premium pricing for high-value customers' },
    ],
    cost_source: 'manual',
    has_cost_data: true,
    llm_model: 'claude-3-5-sonnet',
    prompt_version: 'v1.0',
    schema_version: 'v1.0',
    applied_price_type: 'typical',
    applied_to_price_id: 'price_1',
    created_at: '2026-01-13T10:05:00Z',
  },
];

// Helper functions

export const getPaymentLinksCount = (productId: string): number => {
  return mockPaymentLinks.filter(link => link.product_id === productId).length;
};

export const getPricesByProduct = (productId: string): Price[] => {
  return mockPrices.filter(price => price.product_id === productId);
};

export const getPaymentLinksByProduct = (productId: string): PaymentLink[] => {
  return mockPaymentLinks.filter(link => link.product_id === productId);
};

export const getPricingRecommendationByProduct = (productId: string): PricingRecommendation | undefined => {
  return mockPricingRecommendations.find(rec => rec.product_id === productId);
};

// --- Finance Mock Data ---

export const MOCK_CONNECT_STATUS: Record<ConnectStatusType, ConnectStatus> = {
  not_connected: {
    merchantId: 'm_123',
    status: 'not_connected',
  },
  restricted: {
    merchantId: 'm_123',
    stripeAccountId: 'acct_123',
    status: 'restricted',
    disabledReason: 'Identity verification required',
    requirementsDue: ['identity_document'],
  },
  enabled: {
    merchantId: 'm_123',
    stripeAccountId: 'acct_123',
    status: 'enabled',
  },
};

export const MOCK_BALANCE: Balance = {
  currency: 'USD',
  availableAmount: 4250.5,
  onTheWayAmount: 1280,
  updatedAt: new Date().toISOString(),
};

export const MOCK_PAYOUTS: Payout[] = [
  {
    id: 'po_2',
    merchantId: 'm_123',
    amount: 230,
    currency: 'USD',
    status: 'in_transit',
    arrivalDate: '2026-01-07',
    destinationDisplay: 'Chase ****4242',
    stripePayoutId: 'po_123457',
    createdAt: '2026-01-06T09:30:00Z',
  },
  {
    id: 'po_1',
    merchantId: 'm_123',
    amount: 1500,
    currency: 'USD',
    status: 'paid',
    arrivalDate: '2026-01-05',
    destinationDisplay: 'Chase ****4242',
    stripePayoutId: 'po_123456',
    createdAt: '2026-01-03T10:00:00Z',
  },
];

// --- Subscription Mock Data ---

export const SUBSCRIPTION_PLANS: Record<PlanTier, Plan> = {
  free: {
    tier: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [
      '500 compute units per month',
      '1 team member',
      '1,000 API calls per day',
      'Community support',
    ],
    limits: {
      computeUnits: 500,
      teamMembers: 1,
      apiCalls: 1000,
    },
  },
  starter: {
    tier: 'starter',
    name: 'Starter',
    price: 29,
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [
      '10,000 compute units per month',
      '3 team members',
      '10,000 API calls per day',
      'Email support',
      'Basic analytics',
    ],
    limits: {
      computeUnits: 10000,
      teamMembers: 3,
      apiCalls: 10000,
    },
    overageRate: 0.003, // $0.003 per additional unit
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    price: 49,
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [
      '50,000 compute units per month',
      '10 team members',
      '50,000 API calls per day',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
    ],
    limits: {
      computeUnits: 50000,
      teamMembers: 10,
      apiCalls: 50000,
    },
    overageRate: 0.002, // $0.002 per additional unit
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    price: 199,
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [
      'Unlimited compute units',
      'Unlimited team members',
      'Unlimited API calls',
      'Dedicated support',
      'Custom solutions',
      'SLA guarantee',
    ],
    limits: {
      computeUnits: Infinity,
      teamMembers: Infinity,
      apiCalls: Infinity,
    },
  },
};

export const MOCK_SUBSCRIPTIONS: Record<SubscriptionState, Subscription> = {
  active: {
    id: 'sub_1',
    userId: 'user_1',
    planTier: 'pro',
    state: 'active',
    currentPeriodStart: '2026-01-20T00:00:00Z',
    currentPeriodEnd: '2026-02-20T00:00:00Z',
    cancelAtPeriodEnd: false,
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  trialing: {
    id: 'sub_trial',
    userId: 'user_1',
    planTier: 'pro',
    state: 'trialing',
    currentPeriodStart: '2026-01-15T00:00:00Z',
    currentPeriodEnd: '2026-02-15T00:00:00Z',
    cancelAtPeriodEnd: false,
    trialEnd: '2026-02-15T00:00:00Z',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  past_due: {
    id: 'sub_pastdue',
    userId: 'user_1',
    planTier: 'pro',
    state: 'past_due',
    currentPeriodStart: '2026-01-20T00:00:00Z',
    currentPeriodEnd: '2026-02-20T00:00:00Z',
    cancelAtPeriodEnd: false,
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2026-01-22T00:00:00Z',
  },
  canceled: {
    id: 'sub_canceled',
    userId: 'user_1',
    planTier: 'pro',
    state: 'canceled',
    currentPeriodStart: '2026-01-20T00:00:00Z',
    currentPeriodEnd: '2026-02-20T00:00:00Z',
    cancelAtPeriodEnd: true,
    cancelAt: '2026-02-20T00:00:00Z',
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z',
  },
  expired: {
    id: 'sub_expired',
    userId: 'user_1',
    planTier: 'free',
    state: 'expired',
    currentPeriodStart: '2025-12-20T00:00:00Z',
    currentPeriodEnd: '2026-01-20T00:00:00Z',
    cancelAtPeriodEnd: true,
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
};

export const MOCK_USAGE: Usage = {
  currentPeriod: {
    computeUnits: 8234,
    apiCalls: 4532,
  },
  predicted: {
    computeUnits: 12000,
    apiCalls: 6500,
  },
  percentageUsed: 16.5,
};

export const MOCK_SUBSCRIPTION_INVOICES: SubscriptionInvoice[] = [
  {
    id: 'inv_jan2026',
    subscriptionId: 'sub_1',
    date: '2026-01-20T00:00:00Z',
    amount: 49.00,
    currency: 'USD',
    status: 'paid',
    description: 'Pro Plan - January 2026',
  },
  {
    id: 'inv_dec2025',
    subscriptionId: 'sub_1',
    date: '2025-12-20T00:00:00Z',
    amount: 49.00,
    currency: 'USD',
    status: 'paid',
    description: 'Pro Plan - December 2025',
  },
  {
    id: 'inv_nov2025',
    subscriptionId: 'sub_1',
    date: '2025-11-20T00:00:00Z',
    amount: 29.00,
    currency: 'USD',
    status: 'paid',
    description: 'Starter Plan - November 2025',
  },
];
