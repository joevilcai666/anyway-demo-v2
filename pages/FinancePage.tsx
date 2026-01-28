import React, { useState } from 'react';
import {
  Landmark,
  ArrowUpRight,
  AlertCircle,
  Clock,
  ExternalLink,
  Wallet,
  ChevronRight,
  ShieldCheck,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Info,
  Download,
} from 'lucide-react';
import { ConnectStatus, ConnectStatusType, Balance, Payout, PayoutStatus, BalanceActivity } from '../types';
import { MOCK_CONNECT_STATUS } from '../constants';
import { MOCK_BALANCE_ACTIVITIES, MOCK_PAYOUTS } from '../mockFinanceData';
import WithdrawalModal from '../components/WithdrawalModal';
import { exportBalanceActivityToCSV } from '../services/financeApi';

// --- COMPONENTS ---

const PayoutStatusBadge: React.FC<{ status: PayoutStatus }> = ({ status }) => {
  const styles: Record<PayoutStatus, string> = {
    paid: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-blue-50 text-blue-700 border-blue-200',
    in_transit: 'bg-blue-100 text-blue-800 border-blue-300',
    failed: 'bg-red-50 text-red-700 border-red-200',
    canceled: 'bg-neutral-100 text-neutral-600 border-neutral-200'
  };

  const labels: Record<PayoutStatus, string> = {
    paid: 'Paid',
    pending: 'Pending',
    in_transit: 'In Transit',
    failed: 'Failed',
    canceled: 'Canceled'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const ActivityStatusBadge: React.FC<{ type: BalanceActivity['type'] }> = ({ type }) => {
  const styles: Record<BalanceActivity['type'], string> = {
    payment: 'bg-green-50 text-green-700 border-green-200',
    payout: 'bg-blue-50 text-blue-700 border-blue-200',
    refund: 'bg-amber-50 text-amber-700 border-amber-200',
    fee: 'bg-red-50 text-red-700 border-red-200',
    adjustment: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const labels: Record<BalanceActivity['type'], string> = {
    payment: 'Payment',
    payout: 'Payout',
    refund: 'Refund',
    fee: 'Fee',
    adjustment: 'Adjustment'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[type]}`}>
      {labels[type]}
    </span>
  );
};

const ConnectBanner: React.FC<{ status: ConnectStatus }> = ({ status }) => {
  if (status.status === 'restricted') {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-bold text-red-900">Action required: Your payouts are currently restricted</h3>
            <p className="text-sm text-red-700 mt-1">
              {status.disabledReason || 'Your Stripe account needs additional information before you can receive payouts.'}
            </p>
          </div>
        </div>
        <button className="whitespace-nowrap px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
          Continue Onboarding
        </button>
      </div>
    );
  }

  return null;
};

const FinancePage: React.FC = () => {
  // DEV: Toggle state for demo
  const [devConnectStatus, setDevConnectStatus] = useState<ConnectStatusType>('enabled');

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [balance, setBalance] = useState({ currency: 'USD', availableAmount: 4250.50, onTheWayAmount: 1280.00, updatedAt: new Date().toISOString() });
  const [payouts, setPayouts] = useState(MOCK_PAYOUTS);
  const [activities, setActivities] = useState(MOCK_BALANCE_ACTIVITIES);
  const [pageSize, setPageSize] = useState(20);
  const [isExporting, setIsExporting] = useState(false);

  const currentStatus = MOCK_CONNECT_STATUS[devConnectStatus];
  const isConnected = devConnectStatus !== 'not_connected';

  const handleWithdraw = (amount: number, note?: string, descriptor?: string) => {
    // Optimistic update
    setBalance(prev => ({
      ...prev,
      availableAmount: prev.availableAmount - amount,
      onTheWayAmount: prev.onTheWayAmount + amount
    }));

    const newPayout: Payout = {
      id: `po_new_${Date.now()}`,
      merchantId: 'm_123',
      amount: amount,
      currency: 'USD',
      status: 'pending',
      stripePayoutId: 'po_new',
      destinationDisplay: 'Chase ****4242',
      createdAt: new Date().toISOString(),
      internalNote: note,
      statementDescriptor: descriptor
    };

    setPayouts(prev => [newPayout, ...prev]);

    // Add to balance activities
    const newActivity: BalanceActivity = {
      id: `ba_${Date.now()}`,
      merchantId: 'm_123',
      type: 'payout',
      amount: -amount,
      currency: 'USD',
      description: descriptor ? `Payout: ${descriptor}` : 'Payout to Chase ****4242',
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csv = await exportBalanceActivityToCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `balance-activity-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getWithdrawDisabledReason = () => {
    if (!isConnected) return 'Connect Stripe to enable withdrawals.';
    if (balance.availableAmount <= 0) return 'No available balance to withdraw.';
    if (devConnectStatus === 'restricted') return 'Account restricted.';
    return undefined;
  };

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const formatActivityDate = (isoString?: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Dev Controls (Hidden in Prod) */}
      <div className="bg-neutral-900 text-white text-[10px] px-4 py-1 flex items-center justify-center gap-4">
        <span className="opacity-50 uppercase tracking-wider font-bold">Dev Preview Mode</span>
        <div className="flex gap-2">
          {(['not_connected', 'restricted', 'enabled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setDevConnectStatus(status)}
              className={`px-2 py-0.5 rounded ${devConnectStatus === status ? 'bg-brand-yellow text-neutral-900' : 'bg-neutral-800 text-neutral-400'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Finance</h1>
              <p className="text-sm text-neutral-500 mt-1">
                View balances and payouts powered by Stripe Connect.
              </p>
            </div>

            {/* Main CTA */}
            <div className="relative group">
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                disabled={!isConnected || devConnectStatus === 'restricted' || balance.availableAmount <= 0}
                className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <Landmark size={16} />
                Withdraw
              </button>
              {/* Tooltip for Disabled State */}
              {(!isConnected || devConnectStatus === 'restricted' || balance.availableAmount <= 0) && (
                <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-neutral-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  {getWithdrawDisabledReason()}
                </div>
              )}
            </div>
          </div>

          {/* Restricted Banner */}
          <ConnectBanner status={currentStatus} />

          {!isConnected ? (
            // --- NOT CONNECTED STATE ---
            <div className="space-y-6">
              {/* Warning Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-900">
                <Info className="shrink-0 mt-0.5" size={20} />
                <div className="text-sm">
                  <p className="font-medium">Payment links and payouts are currently unavailable.</p>
                  <p className="mt-1 text-amber-800">
                    You won't be able to generate payment links for your products until Stripe Connect is set up.
                  </p>
                </div>
              </div>

              {/* Main Empty State */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-6">
                  <Landmark size={32} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Connect Stripe to start receiving payments</h2>
                <div className="max-w-lg mb-8 space-y-2 text-neutral-500">
                  <p>
                    Once connected, you'll be able to process payments, track your revenue, and withdraw funds directly to your bank account.
                  </p>
                  <p className="text-amber-700 font-medium">
                    You won't be able to generate payment links for your products until Stripe Connect is set up.
                  </p>
                </div>

                <button className="bg-brand-yellow text-neutral-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-sm text-base">
                  Connect with Stripe
                  <ArrowUpRight size={20} />
                </button>

                <p className="text-xs text-neutral-400 mt-6 flex items-center gap-1">
                  <Info size={12} />
                  Go to <span className="font-medium text-neutral-600 underline cursor-pointer hover:text-blue-600">Products</span> to see more about payment links.
                </p>
              </div>
            </div>
          ) : (
            // --- CONNECTED STATE ---
            <>
              {/* Balance Card (Single Card with Two Sections) */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="text-sm font-medium">Available in your balance</span>
                    </div>
                    <Wallet size={20} className="text-neutral-300" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-neutral-900 tracking-tight">
                    ${balance.availableAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg text-neutral-400 font-normal">{balance.currency}</span>
                  </div>
                </div>

                <div className="p-6 bg-neutral-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Clock size={16} />
                      <span className="text-sm font-medium">On the way to your bank</span>
                    </div>
                    <Clock size={20} className="text-neutral-300" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-neutral-700 tracking-tight">
                    ${balance.onTheWayAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg text-neutral-400 font-normal">{balance.currency}</span>
                  </div>
                </div>
              </div>

              {/* Balance Activity Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-neutral-900">Balance activity</h2>
                  <button
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 disabled:opacity-50 transition-colors"
                  >
                    <Download size={16} />
                    {isExporting ? 'Exporting...' : 'Export CSV'}
                  </button>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-48">Date</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-32">Type</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right w-32">Gross Amount</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right w-32">Fees</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right w-32">Net Amount</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-32">Available On</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {activities.length > 0 ? (
                          activities.map((activity) => (
                            <tr key={activity.id} className="group hover:bg-neutral-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-neutral-600 font-mono whitespace-nowrap">
                                {formatDateTime(activity.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <ActivityStatusBadge type={activity.type} />
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600">
                                {activity.description || '-'}
                              </td>
                              <td className="px-6 py-4 text-sm font-mono font-medium text-neutral-900 text-right whitespace-nowrap">
                                {activity.amount >= 0 ? '$' : '-$'}{Math.abs(activity.amount).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-sm font-mono text-neutral-600 text-right whitespace-nowrap">
                                {(activity.fees || 0) < 0 ? '-$' : '$'}{Math.abs(activity.fees || 0).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-sm font-mono font-medium text-neutral-900 text-right whitespace-nowrap">
                                {activity.netAmount !== undefined
                                  ? (activity.netAmount >= 0 ? '$' : '-$') + Math.abs(activity.netAmount).toFixed(2)
                                  : (activity.amount >= 0 ? '$' : '-$') + Math.abs(activity.amount).toFixed(2)
                                }
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600 font-mono whitespace-nowrap">
                                {formatActivityDate(activity.availableOn)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <a
                                  href="#"
                                  className="text-neutral-400 hover:text-neutral-900 transition-colors opacity-0 group-hover:opacity-100"
                                  title="View details"
                                >
                                  <ExternalLink size={16} />
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="px-6 py-12 text-center text-neutral-500 text-sm">
                              No balance activity yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>Rows per page:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="bg-white border border-neutral-300 rounded px-2 py-1 focus:outline-none focus:border-neutral-500"
                      >
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span>1-{Math.min(activities.length, pageSize)} of {activities.length}</span>
                      <div className="flex gap-1">
                        <button disabled className="p-1 rounded hover:bg-neutral-200 disabled:opacity-30">
                          <ChevronLeft size={16} />
                        </button>
                        <button disabled className="p-1 rounded hover:bg-neutral-200 disabled:opacity-30">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Payouts */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-neutral-900">Recent payouts</h2>

                <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-48">Date</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right w-32">Amount</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-32">Status</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Destination</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {payouts.length > 0 ? (
                          payouts.map((payout) => (
                            <tr key={payout.id} className="group hover:bg-neutral-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-neutral-600 font-mono whitespace-nowrap">
                                {formatDateTime(payout.createdAt)}
                              </td>
                              <td className="px-6 py-4 text-sm font-mono font-medium text-neutral-900 text-right whitespace-nowrap">
                                ${payout.amount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <PayoutStatusBadge status={payout.status} />
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600">
                                <div className="flex items-center gap-2">
                                  <Building2 size={14} className="text-neutral-400" />
                                  {payout.destinationDisplay || 'Bank Account'}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <a
                                  href="#"
                                  className="text-neutral-400 hover:text-neutral-900 transition-colors opacity-0 group-hover:opacity-100"
                                  title="View in Stripe"
                                >
                                  <ExternalLink size={16} />
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 text-sm">
                              No payouts yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>Rows per page:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="bg-white border border-neutral-300 rounded px-2 py-1 focus:outline-none focus:border-neutral-500"
                      >
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span>1-{Math.min(payouts.length, pageSize)} of {payouts.length}</span>
                      <div className="flex gap-1">
                        <button disabled className="p-1 rounded hover:bg-neutral-200 disabled:opacity-30">
                          <ChevronLeft size={16} />
                        </button>
                        <button disabled className="p-1 rounded hover:bg-neutral-200 disabled:opacity-30">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <WithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        balance={balance}
        onConfirm={handleWithdraw}
      />
    </div>
  );
};

export default FinancePage;
