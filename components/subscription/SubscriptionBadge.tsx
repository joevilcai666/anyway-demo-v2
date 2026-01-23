import React from 'react';
import { SubscriptionState } from '../../types';

interface SubscriptionBadgeProps {
  state: SubscriptionState;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ state }) => {
  const styles: Record<SubscriptionState, string> = {
    active: 'bg-green-50 text-green-700 border-green-200',
    trialing: 'bg-blue-50 text-blue-700 border-blue-200',
    past_due: 'bg-red-50 text-red-700 border-red-200',
    canceled: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    expired: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  };

  const labels: Record<SubscriptionState, string> = {
    active: 'Active',
    trialing: 'Trial',
    past_due: 'Past Due',
    canceled: 'Canceling',
    expired: 'Expired',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[state]}`}
    >
      {labels[state]}
    </span>
  );
};

export default SubscriptionBadge;
