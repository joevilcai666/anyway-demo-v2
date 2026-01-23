import React from 'react';
import { AlertCircle, CreditCard, X } from 'lucide-react';
import { Subscription, Plan, SubscriptionState } from '../../types';
import { formatCurrency, getDaysRemaining } from '../../utils';
import SubscriptionBadge from './SubscriptionBadge';
import Button from '../Button';

interface CurrentPlanCardProps {
  subscription: Subscription;
  plan: Plan;
  onManagePayment: () => void;
  onCancelSubscription: () => void;
  onUpgrade: () => void;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  subscription,
  plan,
  onManagePayment,
  onCancelSubscription,
  onUpgrade,
}) => {
  const daysRemaining = getDaysRemaining(subscription.currentPeriodEnd);

  // Render different content based on subscription state
  const renderContent = () => {
    switch (subscription.state) {
      case 'active':
        return (
          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {plan.name} Plan
                  </h3>
                  <SubscriptionBadge state={subscription.state} />
                </div>
                <p className="text-2xl font-mono font-bold text-neutral-900">
                  {plan.price > 0 ? formatCurrency(plan.price) : 'Free'}
                  <span className="text-sm font-normal text-neutral-500">/{plan.billingPeriod}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">
                {subscription.cancelAtPeriodEnd ? (
                  <>Service ends on {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</>
                ) : (
                  <>Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ({daysRemaining} days)</>
                )}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              {!subscription.cancelAtPeriodEnd && plan.price > 0 && (
                <Button variant="secondary" size="sm" onClick={onCancelSubscription}>
                  Cancel Subscription
                </Button>
              )}
            </div>
          </>
        );

      case 'trialing':
        return (
          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {plan.name} Plan
                  </h3>
                  <SubscriptionBadge state={subscription.state} />
                </div>
                <p className="text-2xl font-mono font-bold text-neutral-900">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal text-neutral-500">/{plan.billingPeriod}</span>
                </p>
                <p className="text-sm text-neutral-500 mt-1">after trial ends</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">
                Trial ends on {new Date(subscription.trialEnd || subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm" onClick={onCancelSubscription}>
                Cancel Trial
              </Button>
            </div>
          </>
        );

      case 'past_due':
        return (
          <>
            {/* Warning banner */}
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Payment failed</p>
                <p className="text-sm text-red-700 mt-0.5">Please update your payment method to avoid service interruption.</p>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {plan.name} Plan
                  </h3>
                  <SubscriptionBadge state={subscription.state} />
                </div>
                <p className="text-2xl font-mono font-bold text-neutral-900">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal text-neutral-500">/{plan.billingPeriod}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">
                Past due since {new Date(subscription.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="mt-4">
              <Button variant="primary" size="sm" onClick={onManagePayment}>
                <CreditCard size={16} className="mr-1.5" />
                Update Payment Method
              </Button>
            </div>
          </>
        );

      case 'canceled':
        return (
          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {plan.name} Plan
                  </h3>
                  <SubscriptionBadge state={subscription.state} />
                </div>
                <p className="text-2xl font-mono font-bold text-neutral-900">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal text-neutral-500">/{plan.billingPeriod}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">
                Service ends on {new Date(subscription.cancelAt || subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ({daysRemaining} days)
              </p>
            </div>

            <div className="mt-4">
              <Button variant="secondary" size="sm" onClick={onUpgrade}>
                Reactivate Subscription
              </Button>
            </div>
          </>
        );

      case 'expired':
        return (
          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {plan.name} Plan
                  </h3>
                  <SubscriptionBadge state={subscription.state} />
                </div>
                <p className="text-2xl font-mono font-bold text-neutral-900">
                  {plan.price > 0 ? formatCurrency(plan.price) : 'Free'}
                  <span className="text-sm font-normal text-neutral-500">/{plan.billingPeriod}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">
                Subscription expired on {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                You've been downgraded to the Free plan
              </p>
            </div>

            {plan.price === 0 && (
              <div className="mt-4">
                <Button variant="primary" size="sm" onClick={onUpgrade}>
                  Upgrade Now
                </Button>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
      {renderContent()}
    </div>
  );
};

export default CurrentPlanCard;
