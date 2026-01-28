import { Order, OrderStatus, TimelineEvent } from '../types';
import { MOCK_ORDERS, filterMockOrders, paginateMockOrders, getMockOrderById } from './mockOrdersData';

// ============================================================================
// API Types
// ============================================================================

export interface OrdersQueryParams {
  from?: string; // ISO date string
  to?: string; // ISO date string
  status?: OrderStatus[];
  product_id?: string;
  page?: number;
  page_size?: number;
}

export interface OrdersListResponse {
  orders: Order[];
  total: number;
  page: number;
  page_size: number;
}

export interface OrderDetailResponse {
  order: Order;
  refunds: Refund[];
  stripe_dashboard_url: string;
  payment_method_details?: PaymentMethodDetails;
  timeline?: TimelineEvent[];
}

export interface Refund {
  refund_id: string;
  order_id: string;
  amount: number;
  currency: string;
  created_at: string;
  stripe_refund_id: string;
}

export interface PaymentMethodDetails {
  type: string; // 'card'
  brand: string; // 'visa', 'mastercard'
  last4: string;
  exp_month: number;
  exp_year: number;
  country: string;
  cvc_check: 'pass' | 'fail' | 'unavailable';
  zip_check: 'pass' | 'fail' | 'unavailable';
  owner_name?: string;
  owner_email?: string;
  billing_address?: string;
}

export interface ExportOrdersParams {
  from: string; // ISO date string
  to: string; // ISO date string
  status?: OrderStatus[];
  product_id?: string;
  max_rows: number;
}

export interface ExportOrdersResponse {
  download_url?: string;
  job_id?: string; // For async export
}

// ============================================================================
// API Service
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch orders list with filtering and pagination
 */
export async function fetchOrders(
  params: OrdersQueryParams
): Promise<OrdersListResponse> {
  const queryParams = new URLSearchParams();

  if (params.from) queryParams.append('from', params.from);
  if (params.to) queryParams.append('to', params.to);
  if (params.status && params.status.length > 0) {
    params.status.forEach(s => queryParams.append('status', s));
  }
  if (params.product_id) queryParams.append('product_id', params.product_id);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.page_size) queryParams.append('page_size', params.page_size.toString());

  const url = `${API_BASE_URL}/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    // For MVP, return mock data on error
    return getMockOrdersListResponse(params);
  }
}

/**
 * Fetch order details by ID
 */
export async function fetchOrderDetail(orderId: string): Promise<OrderDetailResponse> {
  const url = `${API_BASE_URL}/orders/${orderId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order details: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching order details:', error);
    // For MVP, return mock data on error
    return getMockOrderDetailResponse(orderId);
  }
}

/**
 * Export orders to CSV
 */
export async function exportOrders(
  params: ExportOrdersParams
): Promise<ExportOrdersResponse> {
  const url = `${API_BASE_URL}/orders/exports`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to export orders: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error exporting orders:', error);
    throw error;
  }
}

/**
 * Download CSV file directly
 */
export function downloadCSV(downloadUrl: string, filename: string = 'orders-export.csv') {
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================================
// Mock Data (for MVP fallback)
// ============================================================================

function getMockOrdersListResponse(params: OrdersQueryParams): OrdersListResponse {
  // Apply filters
  let filteredOrders = filterMockOrders(MOCK_ORDERS, {
    from: params.from ? new Date(params.from) : undefined,
    to: params.to ? new Date(params.to) : undefined,
    status: params.status,
    productId: params.product_id,
  });

  // Pagination
  const page = params.page || 1;
  const pageSize = params.page_size || 50;
  const paginatedOrders = paginateMockOrders(filteredOrders, page, pageSize);

  return {
    orders: paginatedOrders,
    total: filteredOrders.length,
    page,
    page_size: pageSize,
  };
}

function getMockOrderDetailResponse(orderId: string): OrderDetailResponse {
  const order = getMockOrderById(orderId);

  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  return {
    order,
    refunds: [],
    stripe_dashboard_url: order.stripeDashboardUrl,
    payment_method_details: order.paymentMethod,
    timeline: order.timeline,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get date range for "Last N days"
 */
export function getDateRangeForLastDays(days: number): { from: string; to: string } {
  const now = new Date();
  const from = new Date();
  from.setDate(now.getDate() - days);
  from.setHours(0, 0, 0, 0);
  now.setHours(23, 59, 59, 999);

  return {
    from: from.toISOString(),
    to: now.toISOString(),
  };
}

/**
 * Format date for display in YYYY-MM-DD HH:mm format (local timezone)
 */
export function formatOrderDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Format amount with currency, preserving 2 decimal places
 */
export function formatOrderAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
