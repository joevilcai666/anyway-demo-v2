import {
  ConnectStatus,
  Balance,
  Payout,
  BalanceActivity,
  PayoutStatus,
} from '../types';
import { MOCK_BALANCE, MOCK_BALANCE_ACTIVITIES, MOCK_PAYOUTS } from '../mockFinanceData';

// ============================================================================
// Type Definitions for API Requests/Responses
// ============================================================================

export interface ConnectStatusResponse {
  merchantId: string;
  stripeAccountId?: string;
  status: 'not_connected' | 'restricted' | 'enabled';
  disabledReason?: string;
  requirementsDue?: string[];
}

export interface BalanceResponse {
  currency: string;
  availableAmount: number;
  onTheWayAmount: number;
  updatedAt: string;
}

export interface CreatePayoutRequest {
  amount: number;
  idempotencyKey: string;
  internalNote?: string;
  statementDescriptor?: string;
}

export interface CreatePayoutResponse {
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

export interface BalanceActivityResponse {
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

export interface BalanceActivityListResponse {
  activities: BalanceActivityResponse[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Simulate API delay for development
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a random idempotency key
 */
export function generateIdempotencyKey(): string {
  return `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// Mock Data (imported from mockFinanceData.ts)
// ============================================================================

const MOCK_CONNECT_STATUS: ConnectStatusResponse = {
  merchantId: 'm_123',
  stripeAccountId: 'acct_123',
  status: 'enabled',
};

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get Stripe Connect status for the current merchant
 * @returns Promise with ConnectStatusResponse
 */
export async function getConnectStatus(): Promise<ConnectStatusResponse> {
  await delay(500);
  // In production, this would call: GET /finance/connect-status
  return { ...MOCK_CONNECT_STATUS };
}

/**
 * Get balance information for the current merchant
 * @returns Promise with BalanceResponse
 */
export async function getBalance(): Promise<BalanceResponse> {
  await delay(600);
  // In production, this would call: GET /finance/balance
  return { ...MOCK_BALANCE };
}

/**
 * Create a payout to withdraw funds
 * @param request - CreatePayoutRequest with amount, idempotencyKey, and optional fields
 * @returns Promise with CreatePayoutResponse
 */
export async function createPayout(
  request: CreatePayoutRequest
): Promise<CreatePayoutResponse> {
  await delay(1500);

  // Validate amount
  if (request.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (request.amount > MOCK_BALANCE.availableAmount) {
    throw new Error('Insufficient balance');
  }

  // In production, this would call: POST /finance/payouts
  const newPayout: CreatePayoutResponse = {
    id: `po_${Date.now()}`,
    merchantId: 'm_123',
    amount: request.amount,
    currency: 'USD',
    status: 'pending',
    stripePayoutId: `po_${Math.random().toString(36).substring(2, 15)}`,
    destinationDisplay: 'Chase ****4242',
    createdAt: new Date().toISOString(),
    internalNote: request.internalNote,
    statementDescriptor: request.statementDescriptor,
  };

  // Update mock balance
  MOCK_BALANCE.availableAmount -= request.amount;
  MOCK_BALANCE.onTheWayAmount += request.amount;
  MOCK_BALANCE.updatedAt = new Date().toISOString();

  // Add to balance activities
  const newActivity: BalanceActivityResponse = {
    id: `ba_${Date.now()}`,
    merchantId: 'm_123',
    type: 'payout',
    amount: -request.amount,
    currency: 'USD',
    fees: 0,
    netAmount: -request.amount,
    description: request.statementDescriptor
      ? `Payout: ${request.statementDescriptor}`
      : 'Payout to Chase ****4242',
    createdAt: new Date().toISOString(),
  };
  MOCK_BALANCE_ACTIVITIES.unshift(newActivity);

  return newPayout;
}

/**
 * Get balance activity (transactions) with pagination
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with BalanceActivityListResponse
 */
export async function getBalanceActivity(params: {
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}): Promise<BalanceActivityListResponse> {
  await delay(700);

  // In production, this would call: GET /finance/balance-activity
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;

  let activities = [...MOCK_BALANCE_ACTIVITIES];

  // Filter by date range if provided
  if (params.from) {
    const fromDate = new Date(params.from);
    activities = activities.filter(a => new Date(a.createdAt) >= fromDate);
  }
  if (params.to) {
    const toDate = new Date(params.to);
    activities = activities.filter(a => new Date(a.createdAt) <= toDate);
  }

  // Calculate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedActivities = activities.slice(startIndex, endIndex);

  return {
    activities: paginatedActivities,
    total: activities.length,
    page,
    pageSize,
  };
}

/**
 * Get payout history with pagination
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with paginated payouts
 */
export async function getPayouts(params: {
  page?: number;
  pageSize?: number;
}): Promise<{ payouts: Payout[]; total: number; page: number; pageSize: number }> {
  await delay(700);

  // In production, this would call: GET /finance/payouts
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;

  let payouts = [...MOCK_PAYOUTS];

  // Calculate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPayouts = payouts.slice(startIndex, endIndex);

  return {
    payouts: paginatedPayouts,
    total: payouts.length,
    page,
    pageSize,
  };
}

/**
 * Initiate Stripe Connect onboarding flow
 * @returns Promise with onboarding URL
 */
export async function initiateConnectOnboarding(): Promise<{
  success: boolean;
  onboardingUrl?: string;
  error?: string;
}> {
  await delay(1000);

  // In production, this would call: POST /finance/connect-onboarding
  return {
    success: true,
    onboardingUrl: 'https://connect.stripe.com/onboarding/mock-url',
  };
}

/**
 * Export balance activity as CSV
 * @returns Promise with CSV content
 */
export async function exportBalanceActivityToCSV(): Promise<string> {
  await delay(1000);

  // In production, this would call: GET /finance/balance-activity/export

  // CSV Header
  const header = 'Date,Type,Description,Gross Amount,Fees,Net Amount,Available On,Currency\n';

  // CSV Rows
  const rows = MOCK_BALANCE_ACTIVITIES.map(activity => {
    const date = formatActivityDateTime(activity.createdAt);
    const type = formatActivityType(activity.type);
    const description = activity.description || '';
    const grossAmount = activity.amount.toFixed(2);
    const fees = (activity.fees || 0).toFixed(2);
    const netAmount = (activity.netAmount || activity.amount).toFixed(2);
    const availableOn = activity.availableOn || '';
    const currency = activity.currency;

    // Escape commas in description by wrapping in quotes
    const escapedDescription = description.includes(',') ? `"${description}"` : description;

    return `${date},${type},${escapedDescription},${grossAmount},${fees},${netAmount},${availableOn},${currency}`;
  }).join('\n');

  return header + rows;
}

// ============================================================================
// Helper Functions for Balance Activity
// ============================================================================

/**
 * Format balance activity type for display
 */
export function formatActivityType(
  type: BalanceActivityResponse['type']
): string {
  const typeMap: Record<BalanceActivityResponse['type'], string> = {
    payment: 'Payment',
    payout: 'Payout',
    refund: 'Refund',
    fee: 'Fee',
    adjustment: 'Adjustment',
  };
  return typeMap[type] || type;
}

/**
 * Format amount for display with sign and currency
 */
export function formatActivityAmount(
  amount: number,
  currency: string
): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format date for Balance activity table (YYYY-MM-DD HH:mm)
 */
export function formatActivityDateTime(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Format date for Available on column (YYYY-MM-DD)
 */
export function formatActivityDate(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// ============================================================================
// Mock State Management (for development)
// ============================================================================

/**
 * Update mock connect status (for demo purposes)
 */
export function setMockConnectStatus(
  status: ConnectStatusResponse['status']
): void {
  MOCK_CONNECT_STATUS.status = status;
  if (status === 'not_connected') {
    MOCK_CONNECT_STATUS.stripeAccountId = undefined;
  } else {
    MOCK_CONNECT_STATUS.stripeAccountId = 'acct_123';
  }
}

/**
 * Reset mock data to initial state
 */
export function resetMockData(): void {
  MOCK_CONNECT_STATUS.status = 'enabled';
  MOCK_CONNECT_STATUS.stripeAccountId = 'acct_123';
  MOCK_BALANCE.currency = 'USD';
  MOCK_BALANCE.availableAmount = 4250.50;
  MOCK_BALANCE.onTheWayAmount = 1280.00;
  MOCK_BALANCE.updatedAt = new Date().toISOString();
  // Note: MOCK_BALANCE_ACTIVITIES and MOCK_PAYOUTS are imported from mockFinanceData.ts
  // and should be reset there if needed
}
