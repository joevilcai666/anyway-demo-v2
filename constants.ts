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
    token: 'sk_live_89234789234h2k34h2k34',
    type: ApiKeyType.SDK,
    status: ApiKeyStatus.ACTIVE,
    created: '2023-10-24T10:00:00Z',
    lastUsed: '2023-10-25T14:30:00Z',
  },
  {
    id: 'key_2',
    name: 'Staging Environment',
    token: 'sk_test_77234789234h2k34h2k34',
    type: ApiKeyType.SDK,
    status: ApiKeyStatus.INACTIVE,
    created: '2023-09-15T09:00:00Z',
    lastUsed: null,
  }
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
];

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
