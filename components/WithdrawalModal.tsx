import React, { useState } from 'react';
import { Building2, X, Loader2 } from 'lucide-react';
import Modal from './Modal';
import { Balance } from '../types';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: Balance;
  onConfirm: (amount: number, note?: string, descriptor?: string) => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  balance,
  onConfirm,
}) => {
  const [amount, setAmount] = useState<string>(balance.availableAmount.toString());
  const [internalNote, setInternalNote] = useState('');
  const [statementDescriptor, setStatementDescriptor] = useState('ANYWAY STORE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onConfirm(parseFloat(amount), internalNote, statementDescriptor);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pay out funds to your bank account"
      width="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Available Balance (Read-only) */}
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Available Balance
          </label>
          <div className="text-xl font-mono font-medium text-neutral-900">
            ${balance.availableAmount.toFixed(2)}{' '}
            <span className="text-sm text-neutral-400">{balance.currency}</span>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Amount to pay out
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={balance.availableAmount}
              min={1}
              step="0.01"
              className="w-full pl-8 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent font-mono"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">
              {balance.currency}
            </span>
          </div>
        </div>

        {/* Internal Note */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Internal note <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="e.g. Q4 Earnings"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
          />
        </div>

        {/* Statement Descriptor */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Statement Descriptor <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={statementDescriptor}
            onChange={(e) => setStatementDescriptor(e.target.value)}
            placeholder="ANYWAY* PAYOUT"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
          />
          <p className="text-xs text-neutral-500 mt-1">This will appear on your bank statement.</p>
        </div>

        {/* Destination (Read-only) */}
        <div className="bg-neutral-50 rounded-lg p-3 flex items-center gap-3 border border-neutral-100">
          <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500">
            <Building2 size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-500 uppercase">Send to</p>
            <p className="text-sm font-medium text-neutral-900 truncate">Chase Bank ****4242</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > balance.availableAmount
            }
            className="flex-1 px-4 py-2.5 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing
              </>
            ) : (
              `Pay out $${amount || '0'} ${balance.currency}`
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WithdrawalModal;
