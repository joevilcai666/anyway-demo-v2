import { OnboardingFormData } from '../types';

// ============================================================================
// Mock Data
// ============================================================================

interface MockInvitationCode {
  code: string;
  status: 'PENDING' | 'USED' | 'REVOKED';
  email?: string;
}

interface MockAccessRequest {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  useCase: string;
  source?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

// Mock invitation codes database
const MOCK_INVITATION_CODES: MockInvitationCode[] = [
  { code: '12345', status: 'PENDING' },
  { code: '67890', status: 'PENDING' },
  { code: '11111', status: 'USED', email: 'test@example.com' },     // Already used
  { code: '22222', status: 'REVOKED' },  // Revoked
  { code: '54321', status: 'PENDING' },
];

// Mock access requests database
const MOCK_ACCESS_REQUESTS: MockAccessRequest[] = [];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Simulate network delay
 * @param ms - Delay in milliseconds
 * @returns Promise that resolves after delay
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// API Functions
// ============================================================================

/**
 * Validate invitation code
 * @param code - 5-digit invitation code
 * @param email - User email
 * @returns Promise with validation result
 */
export async function validateInvitationCode(
  code: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  await delay(1500); // Simulate network delay

  const invitation = MOCK_INVITATION_CODES.find((c) => c.code === code);

  if (!invitation) {
    return {
      success: false,
      error: 'Invalid invitation code. Please contact support.',
    };
  }

  if (invitation.status === 'USED') {
    return {
      success: false,
      error: 'Invalid invitation code. Please contact support.',
    };
  }

  if (invitation.status === 'REVOKED') {
    return {
      success: false,
      error: 'Invalid invitation code. Please contact support.',
    };
  }

  // Check if email already submitted an access request
  const existingRequest = MOCK_ACCESS_REQUESTS.find((r) => r.email === email);
  if (existingRequest) {
    return {
      success: false,
      error: 'You already have a pending application. We\'ll review it shortly.',
    };
  }

  // Success - mark as used (in real app, this would be transactional)
  invitation.status = 'USED';
  invitation.email = email;

  console.log(`[MOCK] Invitation code ${code} validated for ${email}`);

  return { success: true };
}

/**
 * Submit access request
 * @param data - Access request form data
 * @returns Promise with submission result
 */
export async function submitAccessRequest(
  data: OnboardingFormData
): Promise<{ success: boolean; error?: string }> {
  await delay(2000); // Simulate network delay

  // Check if email already submitted
  const existingRequest = MOCK_ACCESS_REQUESTS.find(
    (r) => r.email === data.email
  );
  if (existingRequest) {
    return {
      success: false,
      error:
        'You already have a pending application. We\'ll review it shortly.',
    };
  }

  // Store request (in real app, save to database)
  const newRequest: MockAccessRequest = {
    id: `req_${Date.now()}`,
    fullName: data.fullName!,
    email: data.email,
    companyName: data.companyName!,
    useCase: data.useCase!,
    source: data.source,
    status: 'PENDING',
    submittedAt: new Date().toISOString(),
  };

  MOCK_ACCESS_REQUESTS.push(newRequest);

  console.log(
    `[MOCK] Access request submitted: ${JSON.stringify(newRequest, null, 2)}`
  );

  return { success: true };
}

/**
 * Send magic link (mock)
 * @param email - User email
 * @returns Promise with send result
 */
export async function sendMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  await delay(1500); // Simulate network delay

  // In real app, send email via backend
  console.log(`[MOCK] Magic link sent to ${email}`);

  return { success: true };
}

/**
 * Resend magic link (mock)
 * @param email - User email
 * @returns Promise with resend result
 */
export async function resendMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  await delay(1000); // Simulate network delay

  console.log(`[MOCK] Magic link resent to ${email}`);

  return { success: true };
}

/**
 * Get all pending access requests (for admin/debugging)
 * @returns Array of pending access requests
 */
export function getPendingAccessRequests(): MockAccessRequest[] {
  return MOCK_ACCESS_REQUESTS.filter((r) => r.status === 'PENDING');
}

/**
 * Get all invitation codes (for admin/debugging)
 * @returns Array of invitation codes
 */
export function getAllInvitationCodes(): MockInvitationCode[] {
  return [...MOCK_INVITATION_CODES];
}
