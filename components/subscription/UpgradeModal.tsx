import React from 'react';
import { Check } from 'lucide-react';
import { Plan } from '../../types';
import { formatCurrency } from '../../utils';
import Modal from '../Modal';
import Button from '../Button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: Plan;
  targetPlan: Plan;
  prorateAmount: number; // Immediate charge
  daysRemaining: number;
  onConfirm: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  targetPlan,
  prorateAmount,
  daysRemaining,
  onConfirm,
}) => {

  const newBillingDate = new Date();
  newBillingDate.setDate(newBillingDate.getDate() + daysRemaining);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            Upgrade to {targetPlan.name}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Get access to more features and higher limits
          </p>
        </div>

        {/* Prorate breakdown */}
        <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-900 mb-3">
            Payment Summary
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Current plan ({currentPlan.name})</span>
              <span>{formatCurrency(currentPlan.price)}/month</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>New plan ({targetPlan.name})</span>
              <span>{formatCurrency(targetPlan.price)}/month</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Days remaining in billing period</span>
              <span>{daysRemaining} days</span>
            </div>
            <div className="border-t border-neutral-300 pt-2 mt-2">
              <div className="flex justify-between text-neutral-900 font-semibold">
                <span>Amount due now</span>
                <span className="text-lg font-mono">{formatCurrency(prorateAmount)}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Prorate calculation: ({formatCurrency(targetPlan.price)} - {formatCurrency(currentPlan.price)}) × ({daysRemaining} / 30)
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              Your new billing cycle starts on{' '}
              <span className="font-semibold">
                {newBillingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </p>
          </div>
        </div>

        {/* Features comparison */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-3">
            What you'll get with {targetPlan.name}
          </h3>
          <ul className="space-y-2">
            {targetPlan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={onConfirm}
          >
            Upgrade and Pay {formatCurrency(prorateAmount)}
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
