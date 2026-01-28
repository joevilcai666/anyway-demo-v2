import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Calendar,
  Box,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  CreditCard,
  FileText,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { Order, OrderStatus, Product } from '../types';
import {
  fetchOrders,
  fetchOrderDetail,
  exportOrders,
  downloadCSV,
  getDateRangeForLastDays,
  formatOrderDateTime,
  formatOrderAmount,
  type OrdersQueryParams,
  type ExportOrdersParams,
} from '../services/ordersApi';
import { mockProducts } from '../constants';

// ============================================================================
// Components
// ============================================================================

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles = {
    paid: 'bg-green-50 text-green-700 border-green-100',
    failed: 'bg-red-50 text-red-700 border-red-100',
    refunded: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    partially_refunded: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    pending: 'bg-blue-50 text-blue-700 border-blue-100',
  };

  const labels = {
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
    partially_refunded: 'Partially Refunded',
    pending: 'Pending',
  };

  return (
    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${styles[status]} uppercase tracking-wide`}>
      {labels[status]}
    </span>
  );
};

const TimelineItem: React.FC<{ event: any; isLast: boolean }> = ({ event, isLast }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_captured':
        return <CheckCircle2 size={14} className="text-green-600" />;
      case 'payment_failed':
        return <AlertCircle size={14} className="text-red-600" />;
      case 'refund_created':
        return <RotateCcw size={14} className="text-neutral-500" />;
      default:
        return <Clock size={14} className="text-neutral-400" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'payment_captured':
        return 'Payment captured';
      case 'payment_failed':
        return 'Payment failed';
      case 'refund_created':
        return 'Refund created';
      case 'payment_started':
        return 'Payment started';
      case 'payment_authorized':
        return 'Payment authorized';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  return (
    <div className="relative pl-6 pb-6 last:pb-0">
      {!isLast && <div className="absolute left-[7px] top-4 bottom-0 w-px bg-neutral-200" />}
      <div className="absolute left-0 top-1 bg-white">{getIcon(event.type)}</div>
      <div>
        <div className="text-sm font-medium text-neutral-900">{getLabel(event.type)}</div>
        <div className="text-xs text-neutral-500 mt-0.5">{formatOrderDateTime(event.timestamp)}</div>
        {event.description && (
          <div className="text-xs text-neutral-600 mt-1 bg-neutral-50 p-2 rounded border border-neutral-100">
            {event.description}
          </div>
        )}
      </div>
    </div>
  );
};

const OrderDetailPanel: React.FC<{ orderId: string; onClose: () => void }> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const loadOrderDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchOrderDetail(orderId);
      setOrder(response.order);
    } catch (err) {
      setError('Failed to load order details');
      console.error('Error loading order details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-[1px] z-40" />
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-neutral-400" size={32} />
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-[1px] z-40" onClick={onClose} />
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col p-6">
          <div className="text-center text-red-600">{error || 'Order not found'}</div>
          <button onClick={onClose} className="mt-4 text-neutral-600 hover:text-neutral-900">
            Close
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-[1px] z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200">
        {/* Header */}
        <div className="px-6 py-6 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-neutral-900 font-mono tracking-tight">
                {formatOrderAmount(order.amount, order.currency)}
              </div>
              <div className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
                From{' '}
                <span className="font-medium text-neutral-900">
                  {order.customerEmail || order.customerExternalId || 'Unknown'}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-2">
            <button className="text-xs font-medium bg-white border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded hover:bg-neutral-50 transition-colors shadow-sm">
              Begin Refund
            </button>
            {order.stripeDashboardUrl && (
              <a
                href={order.stripeDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium bg-white border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-1"
              >
                <ExternalLink size={12} />
                View in Stripe
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Payment Details */}
          <section>
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-4">Payment Details</h3>
            <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-100">
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-neutral-500">Status</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-neutral-500">Date Received</span>
                <span className="text-sm text-neutral-900 font-mono">{formatOrderDateTime(order.createdAt)}</span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-neutral-500">Product</span>
                <span className="text-sm text-neutral-900 font-medium">{order.productName || 'Unknown'}</span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center bg-neutral-50/50">
                <span className="text-sm text-neutral-500">Amount</span>
                <span className="text-sm text-neutral-900 font-mono font-medium">
                  {formatOrderAmount(order.amount, order.currency)}
                </span>
              </div>
              {order.fees && (
                <>
                  <div className="px-4 py-2 flex justify-between items-center pl-8 text-xs bg-neutral-50/30">
                    <span className="text-neutral-500">Processing Fees</span>
                    <span className="text-neutral-600 font-mono">
                      -{formatOrderAmount(order.fees.processing, order.currency)}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between items-center border-t border-neutral-100 font-medium">
                    <span className="text-sm text-neutral-900">Net</span>
                    <span className="text-sm text-green-700 font-mono">
                      {formatOrderAmount(order.fees.net, order.currency)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Payment Method Details */}
          {order.paymentMethod && (
            <section>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-4">Payment Method Details</h3>
              <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-100">
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Payment Method</span>
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-neutral-400" />
                    <span className="text-sm text-neutral-900 capitalize">
                      {order.paymentMethod.brand} Card
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Number</span>
                  <span className="text-sm text-neutral-900 font-mono">
                    •••• {order.paymentMethod.last4}
                  </span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Expires</span>
                  <span className="text-sm text-neutral-900 font-mono">
                    {String(order.paymentMethod.expMonth).padStart(2, '0')}/{order.paymentMethod.expYear}
                  </span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Type</span>
                  <span className="text-sm text-neutral-900 capitalize">{order.paymentMethod.type}</span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Country</span>
                  <span className="text-sm text-neutral-900">{order.paymentMethod.country}</span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">CVC Check</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded border ${
                      order.paymentMethod.cvcCheck === 'pass'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                    }`}
                  >
                    {order.paymentMethod.cvcCheck?.toUpperCase()}
                  </span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Zip Check</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded border ${
                      order.paymentMethod.zipCheck === 'pass'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                    }`}
                  >
                    {order.paymentMethod.zipCheck?.toUpperCase()}
                  </span>
                </div>
                {order.paymentMethod.ownerName && (
                  <div className="px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-neutral-500">Owner</span>
                    <span className="text-sm text-neutral-900">{order.paymentMethod.ownerName}</span>
                  </div>
                )}
                {order.paymentMethod.ownerEmail && (
                  <div className="px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-neutral-500">Owner Email</span>
                    <span className="text-sm text-neutral-900">{order.paymentMethod.ownerEmail}</span>
                  </div>
                )}
                {order.paymentMethod.billingAddress && (
                  <div className="px-4 py-3 flex justify-between items-start">
                    <span className="text-sm text-neutral-500">Address</span>
                    <span className="text-sm text-neutral-900 text-right">{order.paymentMethod.billingAddress}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-4">Timeline</h3>
              <div className="px-2">
                {[...order.timeline].reverse().map((event, idx) => (
                  <TimelineItem key={event.id} event={event} isLast={idx === order.timeline!.length - 1} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

const ExportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentFilters: OrdersQueryParams;
}> = ({ isOpen, onClose, products, currentFilters }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState<'last_7' | 'last_30' | 'last_90' | 'custom'>('last_7');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([]);
  const [maxRows, setMaxRows] = useState(5000);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && currentFilters.from && currentFilters.to) {
      // Preserve current date range if it matches presets
      const range = getDateRangeForLastDays(7);
      if (currentFilters.from === range.from && currentFilters.to === range.to) {
        setDateRange('last_7');
      }
    }
  }, [isOpen, currentFilters]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let from: string;
      let to: string;

      switch (dateRange) {
        case 'last_7':
          ({ from, to } = getDateRangeForLastDays(7));
          break;
        case 'last_30':
          ({ from, to } = getDateRangeForLastDays(30));
          break;
        case 'last_90':
          ({ from, to } = getDateRangeForLastDays(90));
          break;
        case 'custom':
          from = new Date(customFromDate).toISOString();
          to = new Date(customToDate).toISOString();
          break;
      }

      const params: ExportOrdersParams = {
        from,
        to,
        max_rows: maxRows,
      };

      if (selectedProduct) {
        params.product_id = selectedProduct;
      }

      if (selectedStatuses.length > 0) {
        params.status = selectedStatuses;
      }

      const response = await exportOrders(params);

      if (response.download_url) {
        downloadCSV(response.download_url);
        onClose();
      } else if (response.job_id) {
        // Handle async export (show toast, then provide download link later)
        alert(`Export started. Job ID: ${response.job_id}`);
        onClose();
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export orders. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-50 transition-opacity" onClick={onClose} />
      <div
        ref={menuRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-xl shadow-2xl z-50 p-6 border border-neutral-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neutral-900">Export Orders</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-neutral-500 mb-6">
          Export will use your selected filters. You'll receive a CSV file.
        </p>

        <div className="space-y-4 mb-6">
          {/* Date Range */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="last_7">Last 7 days</option>
              <option value="last_30">Last 30 days</option>
              <option value="last_90">Last 90 days</option>
              <option value="custom">Custom range...</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">From</label>
                <input
                  type="date"
                  value={customFromDate}
                  onChange={(e) => setCustomFromDate(e.target.value)}
                  className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">To</label>
                <input
                  type="date"
                  value={customToDate}
                  onChange={(e) => setCustomToDate(e.target.value)}
                  className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>
          )}

          {/* Product Filter */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2">
              Product (Optional)
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2">
              Status (Optional)
            </label>
            <select
              multiple
              value={selectedStatuses}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (opt) => opt.value as OrderStatus);
                setSelectedStatuses(selected);
              }}
              className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent h-24"
            >
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="partially_refunded">Partially Refunded</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Max Rows */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2">
              Max Rows
            </label>
            <select
              value={maxRows}
              onChange={(e) => setMaxRows(Number(e.target.value))}
              className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value={1000}>1,000 rows</option>
              <option value={5000}>5,000 rows (Default)</option>
              <option value={10000}>10,000 rows</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} />
                Export CSV
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// Main Page
// ============================================================================

const OrdersPage: React.FC = () => {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Filters
  const [dateRange, setDateRange] = useState<'last_7' | 'last_30' | 'last_90' | 'custom'>('last_7');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);

  const products = mockProducts;
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Close any open dropdowns if needed
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load orders
  useEffect(() => {
    loadOrders();
  }, [dateRange, customFromDate, customToDate, selectedProductId, selectedStatuses, page, pageSize]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      let from: string;
      let to: string;

      switch (dateRange) {
        case 'last_7':
          ({ from, to } = getDateRangeForLastDays(7));
          break;
        case 'last_30':
          ({ from, to } = getDateRangeForLastDays(30));
          break;
        case 'last_90':
          ({ from, to } = getDateRangeForLastDays(90));
          break;
        case 'custom':
          if (!customFromDate || !customToDate) {
            // Don't fetch if custom dates not set
            setLoading(false);
            return;
          }
          from = new Date(customFromDate).toISOString();
          to = new Date(customToDate).toISOString();
          break;
      }

      const params: OrdersQueryParams = {
        from,
        to,
        page,
        page_size: pageSize,
      };

      if (selectedProductId) {
        params.product_id = selectedProductId;
      }

      if (selectedStatuses.length > 0) {
        params.status = selectedStatuses;
      }

      const response = await fetchOrders(params);
      setOrders(response.orders);
      setTotal(response.total);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterToggle = (status: OrderStatus) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const getCurrentFilters = (): OrdersQueryParams => {
    let from: string;
    let to: string;

    switch (dateRange) {
      case 'last_7':
        ({ from, to } = getDateRangeForLastDays(7));
        break;
      case 'last_30':
        ({ from, to } = getDateRangeForLastDays(30));
        break;
      case 'last_90':
        ({ from, to } = getDateRangeForLastDays(90));
        break;
      case 'custom':
        from = customFromDate ? new Date(customFromDate).toISOString() : '';
        to = customToDate ? new Date(customToDate).toISOString() : '';
        break;
    }

    const params: OrdersQueryParams = { from, to, page, page_size: pageSize };
    if (selectedProductId) params.product_id = selectedProductId;
    if (selectedStatuses.length > 0) params.status = selectedStatuses;

    return params;
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-neutral-200 bg-white flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">Track and manage your revenue and transactions.</p>
        </div>
        <button
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Content */}
      <div className="p-8 flex-1 overflow-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="appearance-none pl-9 pr-8 py-1.5 bg-white border border-neutral-200 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
            >
              <option value="last_7">Last 7 days</option>
              <option value="last_30">Last 30 days</option>
              <option value="last_90">Last 90 days</option>
              <option value="custom">Custom range...</option>
            </select>
            <Calendar size={14} className="text-neutral-500 absolute left-3 pointer-events-none" />
          </div>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.target.value)}
                className="text-sm border border-neutral-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <span className="text-neutral-400">to</span>
              <input
                type="date"
                value={customToDate}
                onChange={(e) => setCustomToDate(e.target.value)}
                className="text-sm border border-neutral-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          )}

          {/* Product Filter */}
          <div className="relative">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="appearance-none pl-9 pr-8 py-1.5 bg-white border border-neutral-200 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
            >
              <option value="">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <Box size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          </div>

          {/* Status Filters */}
          <div className="h-6 w-px bg-neutral-200 mx-2" />

          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => handleStatusFilterToggle('paid')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                selectedStatuses.includes('paid')
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => handleStatusFilterToggle('failed')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                selectedStatuses.includes('failed')
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Failed
            </button>
            <button
              onClick={() => handleStatusFilterToggle('refunded')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                selectedStatuses.includes('refunded')
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Refunded
            </button>
            <button
              onClick={() => handleStatusFilterToggle('partially_refunded')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                selectedStatuses.includes('partially_refunded')
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Partially Refunded
            </button>
            <button
              onClick={() => handleStatusFilterToggle('pending')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                selectedStatuses.includes('pending')
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24 bg-white border border-neutral-200 rounded-lg">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-neutral-200 border-dashed rounded-lg">
            <AlertCircle size={32} className="text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">Failed to load orders</h3>
            <p className="text-neutral-500 text-sm max-w-sm text-center mb-6">{error}</p>
            <button
              onClick={loadOrders}
              className="text-sm font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-80 transition-opacity"
            >
              Try again
            </button>
          </div>
        ) : orders.length > 0 ? (
          /* Table */
          <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                  <th className="px-6 py-3 font-medium w-48">Date</th>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-neutral-900">{formatOrderDateTime(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900 font-medium">
                        {order.productName || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900">
                        {order.customerEmail || order.customerExternalId || 'Unknown'}
                      </div>
                      {order.customerEmail && order.customerExternalId && (
                        <div className="text-xs text-neutral-500 font-mono mt-0.5">
                          {order.customerExternalId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-sm text-neutral-900 font-medium">
                        {formatOrderAmount(order.amount, order.currency)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/30">
              <div className="text-xs text-neutral-500">
                Showing <span className="font-medium text-neutral-900">{startIndex}</span> to{' '}
                <span className="font-medium text-neutral-900">{endIndex}</span> of{' '}
                <span className="font-medium text-neutral-900">{total}</span> results
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="text-xs border border-neutral-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-neutral-400"
                >
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                </select>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-medium text-neutral-700">
                    Page {page} of {totalPages || 1}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-neutral-200 border-dashed rounded-lg">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-300">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">No orders found</h3>
            <p className="text-neutral-500 text-sm max-w-sm text-center mb-6">
              {selectedStatuses.length > 0 || selectedProductId
                ? 'Try adjusting your filters to see more results.'
                : 'When customers purchase your products, their orders will appear here.'}
            </p>
            {selectedStatuses.length > 0 || selectedProductId ? (
              <button
                onClick={() => {
                  setSelectedStatuses([]);
                  setSelectedProductId('');
                  setDateRange('last_7');
                }}
                className="text-sm font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-80 transition-opacity"
              >
                Clear filters
              </button>
            ) : (
              <button className="text-sm font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-80 transition-opacity">
                Go to Products
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedOrderId && (
        <OrderDetailPanel orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        products={products}
        currentFilters={getCurrentFilters()}
      />
    </div>
  );
};

export default OrdersPage;
