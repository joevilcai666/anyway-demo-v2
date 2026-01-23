import { Price, PricingAssistantState, PricingAssistantFormData, PricingRecommendation, SubscriptionState, Usage, UsageWarning } from './types';

// ============================================================================
// Price Formatting Utilities
// ============================================================================

/**
 * Format price based on revenue model
 * @param price - Price object to format
 * @returns Formatted price string (e.g., "$99 USD", "$99/month USD", "$0.10 per API call USD")
 */
export function formatPrice(price: Price): string {
  const amount = formatCurrency(price.unit_amount || 0);
  switch (price.revenue_model) {
    case 'one_time':
      return `${amount} USD`;
    case 'subscription':
      return `${amount}/${price.billing_period === 'monthly' ? 'month' : 'year'} USD`;
    case 'usage_based':
      return `${amount} per ${price.usage_unit_name || 'unit'} USD`;
    default:
      return amount;
  }
}

/**
 * Format currency amount with USD
 * @param amount - Number to format
 * @returns Formatted currency string (e.g., "$99.99")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ============================================================================
// Date/Time Formatting Utilities
// ============================================================================

/**
 * Format date and time in the format "Jan 13, 2026 at 2:35 PM"
 * @param dateString - ISO date string
 * @returns Formatted date/time string
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${month} ${day}, ${year} at ${time}`;
}

/**
 * Format relative time: "Last 7 days", "Last 30 days"
 * @param days - Number of days
 * @returns Formatted relative time string
 */
export function formatRelativeTime(days: number): string {
  if (days === 7) return 'Last 7 days';
  if (days === 30) return 'Last 30 days';
  return `Last ${days} days`;
}

/**
 * Format date as "Jan 13, 2026" (without time)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// ============================================================================
// Throttle & Debounce Utilities
// ============================================================================

/**
 * Create a throttled function that only executes once per delay period
 * @param func - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export function createThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Create a debounced function that executes after delay period
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function createDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// ============================================================================
// Pricing Assistant State Machine Helpers
// ============================================================================

/**
 * Check if Pricing Assistant form has required fields filled
 * @param formData - Form data to check
 * @returns True if can generate suggestion
 */
export function canGenerateSuggestion(formData: PricingAssistantFormData): boolean {
  return !!(formData.target_customer_type && formData.use_case_category);
}

/**
 * Get next state for Pricing Assistant state machine
 * @param currentState - Current state
 * @param action - Action to perform
 * @returns Next state
 */
export function getNextState(
  currentState: PricingAssistantState,
  action: 'open_form' | 'expand_advanced' | 'submit' | 'success' | 'error' | 'modify_inputs'
): PricingAssistantState {
  const stateTransitions: Record<PricingAssistantState, Record<string, PricingAssistantState>> = {
    empty: { open_form: 'form' },
    form: { expand_advanced: 'advanced', submit: 'loading' },
    advanced: { submit: 'loading' },
    loading: { success: 'success', error: 'error' },
    success: { modify_inputs: 'out_of_date', open_form: 'form' },
    error: { submit: 'loading', open_form: 'form' },
    no_cost: { submit: 'loading', open_form: 'form' },
    out_of_date: { submit: 'loading', open_form: 'form' },
  };

  return stateTransitions[currentState]?.[action] || currentState;
}

// ============================================================================
// Mock LLM API (for prototype)
// ============================================================================

/**
 * Generate a mock pricing recommendation with simulated delay
 * @param inputs - Form inputs for pricing
 * @returns Promise with pricing recommendation
 */
export async function generatePricingRecommendation(
  inputs: PricingAssistantFormData
): Promise<PricingRecommendation> {
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

  const hasCost = (inputs.manual_cost ?? 0) > 0;
  const basePrice = hasCost ? inputs.manual_cost! * 2 : 99;
  const timestamp = Date.now();

  return {
    recommendation_id: `rec_${timestamp}`,
    snapshot_id: `snap_${timestamp}`,
    recommended_min_price: Math.round(basePrice * 0.8),
    recommended_typical_price: Math.round(basePrice),
    recommended_max_price: Math.round(basePrice * 1.5),
    confidence_level: hasCost ? 'high' : 'medium',
    assumptions: [
      { title: 'Customer segment', detail: `Targeting ${inputs.target_customer_type}` },
      { title: 'Use case', detail: inputs.use_case_category },
      hasCost
        ? { title: 'Cost data', detail: `Based on provided cost: ${formatCurrency(inputs.manual_cost!)}` }
        : { title: 'No cost data', detail: 'Recommendations based on market benchmarks only' },
    ],
    rationale: [
      { title: 'Min price', detail: 'Covers costs with 20% margin' },
      { title: 'Typical price', detail: 'Aligns with market median' },
      { title: 'Max price', detail: 'Premium pricing for high-value customers' },
    ],
    cost_source: hasCost ? 'manual' : 'none',
    has_cost_data: hasCost,
    llm_model: 'claude-3-5-sonnet',
    prompt_version: 'v1.0',
    schema_version: 'v1.0',
    created_at: new Date().toISOString(),
  };
}

// ============================================================================
// Clipboard Utilities
// ============================================================================

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate product name
 * @param name - Product name to validate
 * @returns Object with isValid flag and error message
 */
export function validateProductName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Product name is required' };
  }
  if (name.length > 255) {
    return { isValid: false, error: 'Product name must be 255 characters or less' };
  }
  return { isValid: true };
}

/**
 * Validate price amount
 * @param amount - Price amount to validate
 * @returns Object with isValid flag and error message
 */
export function validatePriceAmount(amount: number): { isValid: boolean; error?: string } {
  if (isNaN(amount) || amount <= 0) {
    return { isValid: false, error: 'Please enter a valid price' };
  }
  if (amount < 0.01) {
    return { isValid: false, error: 'Price must be at least $0.01' };
  }
  if (amount > 1000000) {
    return { isValid: false, error: 'Price must be $1,000,000 or less' };
  }
  // Check for max 2 decimal places
  const decimalPlaces = amount.toString().split('.')[1]?.length || 0;
  if (decimalPlaces > 2) {
    return { isValid: false, error: 'Price can have at most 2 decimal places' };
  }
  return { isValid: true };
}

/**
 * Validate unit name (for usage-based pricing)
 * @param name - Unit name to validate
 * @returns Object with isValid flag and error message
 */
export function validateUnitName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Unit name is required' };
  }
  if (name.length > 50) {
    return { isValid: false, error: 'Unit name must be 50 characters or less' };
  }
  return { isValid: true };
}

/**
 * Validate use case category (for Pricing Assistant)
 * @param category - Use case category to validate
 * @returns Object with isValid flag and error message
 */
export function validateUseCaseCategory(category: string): { isValid: boolean; error?: string } {
  if (!category || category.trim().length === 0) {
    return { isValid: false, error: 'Use case category is required' };
  }
  if (category.length > 200) {
    return { isValid: false, error: 'Use case must be 200 characters or less' };
  }
  return { isValid: true };
}

// ============================================================================
// Onboarding Validation Utilities
// ============================================================================

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns Object with isValid flag and error message
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Validate invitation code (5 digits)
 * @param code - Invitation code to validate
 * @returns Object with isValid flag and error message
 */
export function validateInvitationCode(code: string): { isValid: boolean; error?: string } {
  if (!code || code.trim().length === 0) {
    return { isValid: false, error: 'Please enter your invitation code' };
  }

  if (!/^\d{5}$/.test(code)) {
    return { isValid: false, error: 'Invitation code must be 5 digits' };
  }

  return { isValid: true };
}

/**
 * Validate full name
 * @param name - Full name to validate
 * @returns Object with isValid flag and error message
 */
export function validateFullName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Please enter your full name' };
  }

  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.length > 100) {
    return { isValid: false, error: 'Name must be 100 characters or less' };
  }

  return { isValid: true };
}

/**
 * Validate company name
 * @param name - Company name to validate
 * @returns Object with isValid flag and error message
 */
export function validateCompanyName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Please enter your company name' };
  }

  if (name.length < 2) {
    return { isValid: false, error: 'Company name must be at least 2 characters' };
  }

  if (name.length > 255) {
    return { isValid: false, error: 'Company name must be 255 characters or less' };
  }

  return { isValid: true };
}

/**
 * Validate use case (20-500 characters)
 * @param text - Use case text to validate
 * @returns Object with isValid flag and error message
 */
export function validateOnboardingUseCase(text: string): { isValid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: 'Please describe your use case' };
  }

  if (text.length < 20) {
    return { isValid: false, error: 'Use case must be at least 20 characters' };
  }

  if (text.length > 500) {
    return { isValid: false, error: 'Use case must be 500 characters or less' };
  }

  return { isValid: true };
}

/**
 * Generate a mock API key for prototype development
 * @returns Mock API key string (e.g., "sk_live_abc123...")
 */
export function generateMockApiKey(): string {
  return 'sk_live_' + Math.random().toString(36).substring(2, 18);
}

// ============================================================================
// Subscription Utilities
// ============================================================================

/**
 * Calculate prorate amount for plan upgrade
 * @param currentPrice - Current plan monthly price
 * @param targetPrice - Target plan monthly price
 * @param daysRemaining - Days remaining in billing period
 * @returns Prorate amount to charge immediately
 */
export function calculateProrateAmount(
  currentPrice: number,
  targetPrice: number,
  daysRemaining: number
): number {
  const priceDiff = targetPrice - currentPrice;
  const prorateFactor = daysRemaining / 30; // Assume 30-day month
  return Math.max(0, priceDiff * prorateFactor);
}

/**
 * Get days remaining in billing period
 * @param periodEnd - ISO date string of period end
 * @returns Number of days remaining
 */
export function getDaysRemaining(periodEnd: string): number {
  const endDate = new Date(periodEnd);
  const today = new Date();
  const diffMs = endDate.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Get subscription status label
 * @param state - Subscription state
 * @returns Human-readable status label
 */
export function getSubscriptionStatusLabel(state: SubscriptionState): string {
  const labels: Record<SubscriptionState, string> = {
    active: 'Active',
    trialing: 'Trial',
    past_due: 'Past Due',
    canceled: 'Canceling',
    expired: 'Expired',
  };
  return labels[state];
}

/**
 * Check if usage exceeds warning threshold
 * @param usage - Usage object
 * @returns Warning object if threshold exceeded
 */
export function getUsageWarning(usage: Usage): UsageWarning | null {
  if (usage.percentageUsed >= 100) {
    return {
      threshold: 100,
      message: 'You have exceeded your plan limit. Additional usage will be billed at your plan\'s overage rate.',
      severity: 'critical',
      action: 'view_overage',
    };
  }
  if (usage.percentageUsed >= 80) {
    return {
      threshold: 80,
      message: 'You\'ve used 80% of your plan. Consider upgrading to avoid overage charges.',
      severity: 'warning',
      action: 'upgrade',
    };
  }
  return null;
}

/**
 * Format subscription period date range
 * @param start - ISO date string
 * @param end - ISO date string
 * @returns Formatted date range (e.g., "Jan 20 - Feb 20, 2026")
 */
export function formatPeriodRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startMonth = startDate.toLocaleString('en-US', { month: 'short' });
  const startDay = startDate.getDate();
  const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
  const endDay = endDate.getDate();
  const year = endDate.getFullYear();

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}
