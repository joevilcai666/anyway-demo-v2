import { Order, OrderStatus, Product } from '../types';
import { mockProducts } from '../constants';

// ============================================================================
// Mock Data Generators
// ============================================================================

const STATUSES: OrderStatus[] = ['paid', 'failed', 'refunded', 'partially_refunded', 'pending'];

const CARD_BRANDS = ['visa', 'mastercard', 'amex', 'discover'];
const CARD_COUNTRIES = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'BR', 'IN', 'MX'];

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Dorothy', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Melissa', 'George', 'Deborah',
  'Timothy', 'Stephanie', 'Ronald', 'Rebecca', 'Edward', 'Sharon', 'Jason', 'Laura',
  'Jeffrey', 'Cynthia', 'Ryan', 'Kathleen', 'Jacob', 'Amy', 'Gary', 'Shirley',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
  'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
  'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz',
  'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales',
  'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson',
];

const DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'company.com', 'startup.io', 'tech.co', 'business.net', 'agency.org',
];

const CUSTOMER_EXTERNAL_IDS = [
  'cust_ext_', 'user_', 'customer_', 'client_', 'acc_', 'id_',
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomEmail(firstName: string, lastName: string): string {
  const variations = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${getRandomInt(1, 999)}`,
    `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}`,
    `${lastName.toLowerCase()}.${firstName.toLowerCase()}`,
  ];
  const username = getRandomItem(variations);
  return `${username}@${getRandomItem(DOMAINS)}`;
}

function generateOrderId(index: number): string {
  return `ord_${String(index).padStart(6, '0')}`;
}

function generateStripeObjectId(prefix: string): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = `${prefix}_`;
  for (let i = 0; i < 24; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateDateWithinLastDays(days: number): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - getRandomInt(0, days * 24 * 60 * 60 * 1000));
  return pastDate;
}

function generateTimelineEvents(orderDate: Date, status: OrderStatus) {
  const events: any[] = [];
  const baseId = `${Date.now()}_${getRandomInt(1000, 9999)}`;

  // Payment started
  events.push({
    id: `evt_${baseId}_1`,
    type: 'payment_started',
    timestamp: orderDate.toISOString(),
    description: 'Checkout started',
  });

  // Simulate events based on status
  if (status === 'paid') {
    const captureDate = new Date(orderDate.getTime() + getRandomInt(2000, 10000));
    events.push({
      id: `evt_${baseId}_2`,
      type: 'payment_captured',
      timestamp: captureDate.toISOString(),
      description: 'Payment succeeded',
    });
  } else if (status === 'failed') {
    const failDate = new Date(orderDate.getTime() + getRandomInt(3000, 15000));
    events.push({
      id: `evt_${baseId}_2`,
      type: 'payment_failed',
      timestamp: failDate.toISOString(),
      description: getRandomItem([
        'Card declined',
        'Insufficient funds',
        'Payment method expired',
        'Bank declined transaction',
      ]),
    });
  } else if (status === 'refunded') {
    const captureDate = new Date(orderDate.getTime() + getRandomInt(2000, 10000));
    const refundDate = new Date(captureDate.getTime() + getRandomInt(3600000, 86400000 * 3));
    events.push({
      id: `evt_${baseId}_2`,
      type: 'payment_captured',
      timestamp: captureDate.toISOString(),
      description: 'Payment succeeded',
    });
    events.push({
      id: `evt_${baseId}_3`,
      type: 'refund_created',
      timestamp: refundDate.toISOString(),
      description: 'Full refund issued',
    });
  } else if (status === 'partially_refunded') {
    const captureDate = new Date(orderDate.getTime() + getRandomInt(2000, 10000));
    const refundDate = new Date(captureDate.getTime() + getRandomInt(3600000, 86400000 * 5));
    const refundPercent = getRandomInt(20, 80);
    events.push({
      id: `evt_${baseId}_2`,
      type: 'payment_captured',
      timestamp: captureDate.toISOString(),
      description: 'Payment succeeded',
    });
    events.push({
      id: `evt_${baseId}_3`,
      type: 'refund_created',
      timestamp: refundDate.toISOString(),
      description: `Partial refund: ${refundPercent}%`,
    });
  } else if (status === 'pending') {
    // Just the payment started event
  }

  return events;
}

function calculateFees(amount: number, currency: string) {
  // Stripe's typical fee: 2.9% + $0.30 for US cards
  const processingFee = (amount * 0.029) + 0.30;
  const net = amount - processingFee;

  return {
    processing: Math.round(processingFee * 100) / 100,
    net: Math.round(net * 100) / 100,
  };
}

// ============================================================================
// Generate Mock Orders
// ============================================================================

export function generateMockOrders(count: number = 100): Order[] {
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const status = getRandomItem(STATUSES);
    const product = getRandomItem(mockProducts);
    const amount = getRandomInt(9, 299) + Math.round(Math.random() * 100) / 100;
    const currency = 'USD';
    const firstName = getRandomItem(FIRST_NAMES);
    const lastName = getRandomItem(LAST_NAMES);
    const customerEmail = generateRandomEmail(firstName, lastName);
    const customerExternalId = `${getRandomItem(CUSTOMER_EXTERNAL_IDS)}${getRandomInt(10000, 99999)}`;
    const orderDate = generateDateWithinLastDays(90);
    const orderId = generateOrderId(i + 1);
    const stripeObjectId = generateStripeObjectId('pi');
    const cardBrand = getRandomItem(CARD_BRANDS);
    const last4 = String(getRandomInt(1000, 9999));

    const order: Order = {
      id: orderId,
      merchantId: 'mer_001',
      productId: product.id,
      productName: product.name,
      customerEmail,
      customerExternalId,
      amount,
      currency,
      status,
      createdAt: orderDate.toISOString(),
      stripeObject: 'payment_intent',
      stripeObjectId,
      stripeDashboardUrl: `https://dashboard.stripe.com/test/payments/${stripeObjectId}`,
    };

    // Add payment method for non-pending orders
    if (status !== 'pending') {
      const expYear = new Date().getFullYear() + getRandomInt(1, 5);
      const expMonth = getRandomInt(1, 12);

      order.paymentMethod = {
        type: 'card',
        brand: cardBrand,
        last4,
        expMonth,
        expYear,
        country: getRandomItem(CARD_COUNTRIES),
        cvcCheck: getRandomItem(['pass', 'pass', 'pass', 'pass', 'unavailable']),
        zipCheck: getRandomItem(['pass', 'pass', 'pass', 'fail', 'unavailable']),
        ownerName: `${firstName} ${lastName}`,
        ownerEmail: customerEmail,
        billingAddress: `${getRandomInt(100, 9999)} ${getRandomItem(['Main St', 'Oak Ave', 'Elm St', 'Pine Rd'])}`,
      };

      // Add fees for successful or partially refunded orders
      if (status === 'paid' || status === 'partially_refunded') {
        order.fees = calculateFees(amount, currency);
      }
    }

    // Add timeline
    order.timeline = generateTimelineEvents(orderDate, status);

    orders.push(order);
  }

  // Sort by date descending
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return orders;
}

// ============================================================================
// Pre-generated Mock Data (for faster loading)
// ============================================================================

export const MOCK_ORDERS = generateMockOrders(100);

// ============================================================================
// Helper Functions
// ============================================================================

export function getMockOrderById(orderId: string): Order | undefined {
  return MOCK_ORDERS.find(o => o.id === orderId);
}

export function filterMockOrders(
  orders: Order[],
  filters: {
    from?: Date;
    to?: Date;
    status?: OrderStatus[];
    productId?: string;
  }
): Order[] {
  let filtered = [...orders];

  if (filters.from) {
    filtered = filtered.filter(o => new Date(o.createdAt) >= filters.from!);
  }

  if (filters.to) {
    filtered = filtered.filter(o => new Date(o.createdAt) <= filters.to!);
  }

  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(o => filters.status!.includes(o.status));
  }

  if (filters.productId) {
    filtered = filtered.filter(o => o.productId === filters.productId);
  }

  return filtered;
}

export function paginateMockOrders(
  orders: Order[],
  page: number,
  pageSize: number
): Order[] {
  const startIndex = (page - 1) * pageSize;
  return orders.slice(startIndex, startIndex + pageSize);
}

export function getMockOrdersStats(orders: Order[]): {
  total: number;
  paid: number;
  failed: number;
  refunded: number;
  partiallyRefunded: number;
  pending: number;
  totalRevenue: number;
} {
  return {
    total: orders.length,
    paid: orders.filter(o => o.status === 'paid').length,
    failed: orders.filter(o => o.status === 'failed').length,
    refunded: orders.filter(o => o.status === 'refunded').length,
    partiallyRefunded: orders.filter(o => o.status === 'partially_refunded').length,
    pending: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders
      .filter(o => o.status === 'paid' || o.status === 'partially_refunded')
      .reduce((sum, o) => sum + (o.fees?.net || o.amount), 0),
  };
}
