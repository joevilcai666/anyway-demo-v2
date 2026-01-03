import { ApiKey, ApiKeyStatus, ApiKeyType, Delivery, DeliveryStatus, Step, Invoice, DailyUsage } from './types';

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
    cost: Math.random() * 5 + 10, // 10-15 dollars
    tokens: Math.floor(Math.random() * 1000000)
  };
});

// Helper to format dates like "Oct 24"
export const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper for timestamp in table (e.g. "Oct 24, 14:30")
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const MASK_CHAR = '•';

// --- Dashboard Mock Data ---

// Base time for calculations
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

const MOCK_STEPS_FAILED: Step[] = [
  { 
    id: 'f1', depth: 0, name: 'User Input', type: 'system', status: 'success', 
    startTime: new Date(NOW - 10000).toISOString(), endTime: new Date(NOW - 9900).toISOString(), durationMs: 100, durationLabel: '0.1s',
    cost: 0, 
    spanId: 'span_f1' 
  },
  { 
    id: 'f2', depth: 0, name: 'Code Generation', type: 'llm', status: 'success', 
    startTime: new Date(NOW - 9800).toISOString(), endTime: new Date(NOW - 7800).toISOString(), durationMs: 2000, durationLabel: '2.0s',
    cost: 0.004, provider: 'anthropic', model: 'claude-3-5-sonnet',
    tokensTotal: 1200, tokensIn: 800, tokensOut: 400, finishReason: 'stop',
    spanId: 'span_f2'
  },
  { 
    id: 'f3', depth: 0, name: 'Execute Code', type: 'tool', status: 'failed', 
    startTime: new Date(NOW - 7700).toISOString(), endTime: new Date(NOW - 7200).toISOString(), durationMs: 500, durationLabel: '0.5s',
    cost: 0.001, error: 'RuntimeError: Division by zero',
    provider: 'python', model: 'sandbox-3.10',
    spanId: 'span_f3'
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
  {
    id: 'del_89233',
    timestamp: new Date(NOW - 10000).toISOString(),
    agentName: 'Coding Bot',
    userEmail: 'dev@example.com',
    status: 'failed',
    stepCount: 3,
    totalTokens: 1200,
    totalCost: 0.005,
    duration: '2.6s',
    durationMs: 2600,
    steps: MOCK_STEPS_FAILED,
  },
];

export const TEST_LIVE_DELIVERY: Delivery = {
  id: 'del_live_001',
  timestamp: new Date().toISOString(),
  agentName: 'My First Agent',
  userEmail: 'me@myself.com',
  status: 'success',
  stepCount: 4,
  totalTokens: 450,
  totalCost: 0.004,
  duration: '3.2s',
  durationMs: 3200,
  steps: [
    { id: 'l1', depth: 0, name: 'Init', type: 'system', status: 'success', startTime: new Date().toISOString(), endTime: new Date().toISOString(), durationMs: 100, durationLabel: '0.1s', cost: 0 },
    { id: 'l2', depth: 0, name: 'Hello World LLM', type: 'llm', status: 'success', startTime: new Date().toISOString(), endTime: new Date().toISOString(), durationMs: 800, durationLabel: '0.8s', cost: 0.001, provider: 'openai', model: 'gpt-4o', tokensTotal: 70, tokensIn: 50, tokensOut: 20 },
    { id: 'l3', depth: 0, name: 'Tool Call', type: 'tool', status: 'success', startTime: new Date().toISOString(), endTime: new Date().toISOString(), durationMs: 1200, durationLabel: '1.2s', cost: 0.002, provider: 'google', model: 'maps', input: 'New York' },
    { id: 'l4', depth: 0, name: 'Response', type: 'llm', status: 'success', startTime: new Date().toISOString(), endTime: new Date().toISOString(), durationMs: 1100, durationLabel: '1.1s', cost: 0.001, provider: 'openai', model: 'gpt-4o', tokensTotal: 400, tokensIn: 300, tokensOut: 100 },
  ],
  artifacts: [{ name: 'Greeting.txt', url: '#' }]
};