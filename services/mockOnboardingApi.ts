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

const MOCK_INVITATION_CODES: MockInvitationCode[] = [
  { code: '12345', status: 'PENDING' },
  { code: '67890', status: 'PENDING' },
];

const MOCK_ACCESS_REQUESTS: MockAccessRequest[] = [];

// ============================================================================
// Utility Functions
// ============================================================================

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// API Functions
// ============================================================================

const INVALID_CODE_ERROR = 'Invalid invitation code. Please contact support.';
const PENDING_APPLICATION_ERROR =
  "You already have a pending application. We'll review it shortly.";

export async function validateInvitationCode(
  code: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  await delay(1500);

  const invitation = MOCK_INVITATION_CODES.find((c) => c.code === code);

  if (!invitation || invitation.status !== 'PENDING') {
    return { success: false, error: INVALID_CODE_ERROR };
  }

  const existingRequest = MOCK_ACCESS_REQUESTS.find((r) => r.email === email);
  if (existingRequest) {
    return { success: false, error: PENDING_APPLICATION_ERROR };
  }

  invitation.status = 'USED';
  invitation.email = email;

  return { success: true };
}

export async function submitAccessRequest(
  data: OnboardingFormData
): Promise<{ success: boolean; error?: string }> {
  await delay(2000);

  const existingRequest = MOCK_ACCESS_REQUESTS.find(
    (r) => r.email === data.email
  );
  if (existingRequest) {
    return { success: false, error: PENDING_APPLICATION_ERROR };
  }

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

  return { success: true };
}

export async function sendMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  await delay(1500);
  return { success: true };
}

export async function resendMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  await delay(1000);
  return { success: true };
}

export function getPendingAccessRequests(): MockAccessRequest[] {
  return MOCK_ACCESS_REQUESTS.filter((r) => r.status === 'PENDING');
}

export function getAllInvitationCodes(): MockInvitationCode[] {
  return [...MOCK_INVITATION_CODES];
}
