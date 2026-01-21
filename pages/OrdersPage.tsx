import React, { useState } from 'react';
import { 
  Download, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  X,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Copy,
  Calendar,
  Box,
  FileText
} from 'lucide-react';
import { Order, OrderStatus, TimelineEvent } from '../types';

// --- Mock Data ---

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_01',
    merchantId: 'mer_01',
    productId: 'prod_01',
    productName: 'Code Review Agent',
    customerEmail: 'dev.team@startup.io',
    amount: 29.00,
    currency: 'USD',
    status: 'paid',
    createdAt: '2024-01-05T14:30:00Z',
    stripeObject: 'payment_intent',
    stripeObjectId: 'pi_3Kx2...',
    stripeDashboardUrl: '#',
    paymentMethod: {
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      country: 'US',
      cvcCheck: 'pass',
      zipCheck: 'pass',
      ownerName: 'John Developer'
    },
    fees: {
      processing: 1.14,
      net: 27.86
    },
    timeline: [
      { id: 'evt_1', type: 'payment_captured', timestamp: '2024-01-05T14:30:05Z', description: 'Payment succeeded' },
      { id: 'evt_2', type: 'payment_started', timestamp: '2024-01-05T14:30:00Z', description: 'Checkout started' }
    ]
  },
  {
    id: 'ord_02',
    merchantId: 'mer_01',
    productId: 'prod_02',
    productName: 'SEO Blog Generator',
    customerEmail: 'marketing@agency.com',
    amount: 49.00,
    currency: 'USD',
    status: 'paid',
    createdAt: '2024-01-05T12:15:00Z',
    stripeObject: 'payment_intent',
    stripeObjectId: 'pi_3Kx3...',
    stripeDashboardUrl: '#',
    paymentMethod: {
      type: 'card',
      brand: 'mastercard',
      last4: '8888',
      expMonth: 10,
      expYear: 2024,
      country: 'GB',
      cvcCheck: 'pass',
      zipCheck: 'pass'
    },
    fees: {
      processing: 1.72,
      net: 47.28
    },
    timeline: [
      { id: 'evt_3', type: 'payment_captured', timestamp: '2024-01-05T12:15:05Z' },
      { id: 'evt_4', type: 'payment_started', timestamp: '2024-01-05T12:15:00Z' }
    ]
  }
];

// --- Components ---

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

const TimelineItem: React.FC<{ event: TimelineEvent, isLast: boolean }> = ({ event, isLast }) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'payment_captured': return <CheckCircle2 size={14} className="text-green-600" />;
      case 'payment_failed': return <AlertCircle size={14} className="text-red-600" />;
      case 'refund_created': return <RotateCcw size={14} className="text-neutral-500" />;
      default: return <Clock size={14} className="text-neutral-400" />;
    }
  };

  return (
    <div className="relative pl-6 pb-6 last:pb-0">
      {!isLast && (
        <div className="absolute left-[7px] top-4 bottom-0 w-px bg-neutral-200" />
      )}
      <div className="absolute left-0 top-1 bg-white">
        {getIcon(event.type)}
      </div>
      <div>
        <div className="text-sm font-medium text-neutral-900 capitalize">
          {event.type.replace(/_/g, ' ')}
        </div>
        <div className="text-xs text-neutral-500 mt-0.5">
          {new Date(event.timestamp).toLocaleString()}
        </div>
        {event.description && (
          <div className="text-xs text-neutral-600 mt-1 bg-neutral-50 p-2 rounded border border-neutral-100">
            {event.description}
          </div>
        )}
      </div>
    </div>
  );
};

const OrderDetailPanel: React.FC<{ order: Order, onClose: () => void }> = ({ order, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/20 backdrop-blur-[1px] z-40 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200 transform transition-transform duration-300">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-neutral-900 font-mono tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency }).format(order.amount)}
              </div>
              <div className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
                From <span className="font-medium text-neutral-900">{order.customerEmail}</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button className="text-xs font-medium bg-white border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded hover:bg-neutral-50 transition-colors shadow-sm">
              Begin Refund
            </button>
            <button className="text-xs font-medium bg-white border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-1">
              <ExternalLink size={12} />
              View in Stripe
            </button>
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
                <span className="text-sm text-neutral-900 font-mono">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-neutral-500">Product</span>
                <span className="text-sm text-neutral-900 font-medium">{order.productName || 'Unknown'}</span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center bg-neutral-50/50">
                <span className="text-sm text-neutral-500">Amount</span>
                <span className="text-sm text-neutral-900 font-mono font-medium">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency }).format(order.amount)}
                </span>
              </div>
              {order.fees && (
                <>
                  <div className="px-4 py-2 flex justify-between items-center pl-8 text-xs bg-neutral-50/30">
                    <span className="text-neutral-500">Processing Fees</span>
                    <span className="text-neutral-600 font-mono">
                      -{new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency }).format(order.fees.processing)}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between items-center border-t border-neutral-100 font-medium">
                    <span className="text-sm text-neutral-900">Net</span>
                    <span className="text-sm text-green-700 font-mono">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency }).format(order.fees.net)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Payment Method */}
          {order.paymentMethod && (
            <section>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-4">Payment Method</h3>
              <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-100">
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Method</span>
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-neutral-400" />
                    <span className="text-sm text-neutral-900 capitalize">
                      {order.paymentMethod.brand} •••• {order.paymentMethod.last4}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Expires</span>
                  <span className="text-sm text-neutral-900 font-mono">
                    {order.paymentMethod.expMonth.toString().padStart(2, '0')}/{order.paymentMethod.expYear}
                  </span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Owner</span>
                  <span className="text-sm text-neutral-900">{order.paymentMethod.ownerName || '-'}</span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Checks</span>
                  <div className="flex gap-3">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${
                      order.paymentMethod.cvcCheck === 'pass' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                    }`}>
                      CVC: {order.paymentMethod.cvcCheck?.toUpperCase()}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${
                      order.paymentMethod.zipCheck === 'pass' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                    }`}>
                      ZIP: {order.paymentMethod.zipCheck?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Timeline */}
          {order.timeline && (
            <section>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-4">Timeline</h3>
              <div className="px-2">
                {order.timeline.map((event, idx) => (
                  <TimelineItem 
                    key={event.id} 
                    event={event} 
                    isLast={idx === (order.timeline?.length || 0) - 1} 
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
};

const ExportModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-50 transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-xl shadow-2xl z-50 p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neutral-900">Export Orders</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm text-neutral-500 mb-6">
          Export will follow your current filters. You will receive a CSV file.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2">Date Range</label>
            <select className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent">
              <option>Last 7 days (Current)</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Custom range...</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2">Max Rows</label>
            <select className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent">
              <option>5,000 rows (Default)</option>
              <option>1,000 rows</option>
              <option>10,000 rows</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              // Mock export action
              setTimeout(onClose, 500);
            }}
            className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>
    </>
  );
};

// --- Main Page ---

const OrdersPage: React.FC = () => {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const filteredOrders = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

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
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
            <Calendar size={14} className="text-neutral-500" />
            Last 7 days
          </button>

          {/* Product Filter */}
          <div className="relative">
            <select className="appearance-none pl-9 pr-8 py-1.5 bg-white border border-neutral-200 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer">
              <option>All Products</option>
              <option>Code Review Agent</option>
              <option>SEO Blog Generator</option>
            </select>
            <Box size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          </div>

          {/* Status Filter */}
          <div className="h-6 w-px bg-neutral-200 mx-2" />
          
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
            {(['all', 'paid', 'failed', 'refunded'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-3 py-1 text-xs font-medium rounded-md transition-all
                  ${filterStatus === status 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'}
                `}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filteredOrders.length > 0 ? (
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
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrderId(order.id)}
                    className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-neutral-900">
                        {new Date(order.createdAt).toLocaleString(undefined, { 
                          year: 'numeric', month: 'numeric', day: 'numeric', 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900 font-medium">{order.productName || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900">{order.customerEmail}</div>
                      {order.customerExternalId && (
                        <div className="text-xs text-neutral-500 font-mono mt-0.5">{order.customerExternalId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-sm text-neutral-900 font-medium">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency }).format(order.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/30">
              <div className="text-xs text-neutral-500">
                Showing <span className="font-medium text-neutral-900">{filteredOrders.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-medium text-neutral-700">Page 1 of 1</span>
                <button className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-50" disabled>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-neutral-200 border-dashed rounded-lg">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-300">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {filterStatus === 'all' ? 'No orders yet' : 'No matching orders'}
            </h3>
            <p className="text-neutral-500 text-sm max-w-sm text-center mb-6">
              {filterStatus === 'all' 
                ? "When customers purchase your products, their orders will appear here."
                : `There are no orders with status "${filterStatus}".`
              }
            </p>
            {filterStatus === 'all' && (
              <button className="text-sm font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-80 transition-opacity">
                Go to Products
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedOrder && (
        <OrderDetailPanel 
          order={selectedOrder} 
          onClose={() => setSelectedOrderId(null)} 
        />
      )}

      {/* Export Modal */}
      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
      />
    </div>
  );
};

export default OrdersPage;
