import React from 'react';
import { Download } from 'lucide-react';
import { SubscriptionInvoice } from '../../types';
import { formatDate, formatCurrency } from '../../utils';
import Button from '../Button';

interface BillingHistoryCardProps {
  invoices: SubscriptionInvoice[];
  onViewInvoice: (invoiceId: string) => void;
}

const BillingHistoryCard: React.FC<BillingHistoryCardProps> = ({
  invoices,
  onViewInvoice,
}) => {
  const getStatusBadge = (status: SubscriptionInvoice['status']) => {
    const styles = {
      paid: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-blue-50 text-blue-700 border-blue-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
    };

    const labels = {
      paid: 'Paid',
      pending: 'Pending',
      failed: 'Failed',
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900">
          Billing History
        </h3>
      </div>

      {invoices.length === 0 ? (
        <div className="p-6 text-center text-sm text-neutral-500">
          No invoices yet
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {invoices.slice(0, 5).map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-neutral-600 whitespace-nowrap">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-900">
                      {invoice.description || `Invoice ${invoice.id}`}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-medium text-neutral-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewInvoice(invoice.id)}
                        className="inline-flex items-center gap-1"
                      >
                        <Download size={14} />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {invoices.length > 5 && (
            <div className="p-4 border-t border-neutral-200 text-center">
              <Button variant="ghost" size="sm" onClick={() => alert('View all invoices')}>
                View All Invoices
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BillingHistoryCard;
