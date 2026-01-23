import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Subscription,
  SubscriptionState,
  PlanTier,
  Usage,
  SubscriptionInvoice,
} from '../types';
import {
  MOCK_SUBSCRIPTIONS,
  MOCK_USAGE,
  MOCK_SUBSCRIPTION_INVOICES,
  SUBSCRIPTION_PLANS,
} from '../constants';
import { calculateProrateAmount, getDaysRemaining } from '../utils';
import { useToast } from '../contexts/ToastContext';
import CurrentPlanCard from '../components/subscription/CurrentPlanCard';
import UsageProgressCard from '../components/subscription/UsageProgressCard';
import PlanComparisonCard from '../components/subscription/PlanComparisonCard';
import BillingHistoryCard from '../components/subscription/BillingHistoryCard';
import UpgradeModal from '../components/subscription/UpgradeModal';
import CancelModal from '../components/subscription/CancelModal';

const SubscriptionPage: React.FC = () => {
  const { showToast } = useToast() || { showToast: () => {} };

  // State
  const [subscription, setSubscription] = useState<Subscription>(MOCK_SUBSCRIPTIONS.active);
  const [usage, setUsage] = useState<Usage>(MOCK_USAGE);
  const [invoices] = useState<SubscriptionInvoice[]>(MOCK_SUBSCRIPTION_INVOICES);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<PlanTier | null>(null);

  // Dev controls for testing different states
  const [devSubscriptionState, setDevSubscriptionState] = useState<SubscriptionState>('active');
  const [devUsageLevel, setDevUsageLevel] = useState<'low' | 'warning' | 'critical' | 'overage'>('low');

  // Get current plan
  const currentPlan = SUBSCRIPTION_PLANS[subscription.planTier];

  // Handle actions
  const handleManagePayment = () => {
    showToast('Opening Stripe payment portal...');
    // In production, this would open Stripe portal
  };

  const handleCancelSubscription = () => {
    setIsCancelModalOpen(true);
  };

  const handleUpgrade = (tier: PlanTier) => {
    setTargetPlan(tier);
    setIsUpgradeModalOpen(true);
  };

  const confirmUpgrade = () => {
    if (!targetPlan) return;

    const daysRemaining = getDaysRemaining(subscription.currentPeriodEnd);
    const prorateAmount = calculateProrateAmount(
      currentPlan.price,
      SUBSCRIPTION_PLANS[targetPlan].price,
      daysRemaining
    );

    // Simulate API call
    setTimeout(() => {
      setSubscription({
        ...subscription,
        planTier: targetPlan,
        state: 'active',
        updatedAt: new Date().toISOString(),
      });
      setIsUpgradeModalOpen(false);
      showToast(`Successfully upgraded to ${SUBSCRIPTION_PLANS[targetPlan].name}!`);
    }, 1500);
  };

  const confirmCancel = (reason?: string) => {
    // Simulate API call
    setTimeout(() => {
      setSubscription({
        ...subscription,
        state: 'canceled',
        cancelAtPeriodEnd: true,
        cancelAt: subscription.currentPeriodEnd,
        updatedAt: new Date().toISOString(),
      });
      setIsCancelModalOpen(false);
      showToast('Subscription will be canceled at the end of your billing period.');
      if (reason) {
        console.log('Cancellation reason:', reason);
      }
    }, 1000);
  };

  const handleContactSales = () => {
    showToast('Opening contact sales form...');
    // In production, this would open a contact form or email
  };

  const handleViewInvoice = (invoiceId: string) => {
    showToast(`Opening invoice ${invoiceId}...`);
    // In production, this would open the invoice PDF
  };

  // Dev controls: change subscription state
  const handleDevStateChange = (state: SubscriptionState) => {
    setDevSubscriptionState(state);
    setSubscription(MOCK_SUBSCRIPTIONS[state]);
    showToast(`Switched to ${state} state`);
  };

  // Dev controls: change usage level
  const handleUsageLevelChange = (level: 'low' | 'warning' | 'critical' | 'overage') => {
    setDevUsageLevel(level);

    const usageLevels = {
      low: { current: 8000, apiCalls: 4500, percentage: 16, predicted: 12000, predictedApiCalls: 6500 },
      warning: { current: 40000, apiCalls: 22000, percentage: 80, predicted: 48000, predictedApiCalls: 26000 },
      critical: { current: 50000, apiCalls: 27500, percentage: 100, predicted: 52000, predictedApiCalls: 28000 },
      overage: { current: 60000, apiCalls: 33000, percentage: 120, predicted: 65000, predictedApiCalls: 35000 },
    };

    const selectedLevel = usageLevels[level];
    setUsage({
      currentPeriod: {
        computeUnits: selectedLevel.current,
        apiCalls: selectedLevel.apiCalls,
      },
      predicted: {
        computeUnits: selectedLevel.predicted,
        apiCalls: selectedLevel.predictedApiCalls,
      },
      percentageUsed: selectedLevel.percentage,
    });
    showToast(`Usage level: ${level}`);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Dev Controls Bar */}
      <div className="bg-neutral-900 text-white px-6 py-3 flex items-center gap-6 flex-shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Dev Controls
        </span>

        {/* Subscription state toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">State:</span>
          <select
            value={devSubscriptionState}
            onChange={(e) => handleDevStateChange(e.target.value as SubscriptionState)}
            className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-yellow"
          >
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Usage level toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Usage:</span>
          <select
            value={devUsageLevel}
            onChange={(e) => handleUsageLevelChange(e.target.value as any)}
            className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-yellow"
          >
            <option value="low">Low (16%)</option>
            <option value="warning">Warning (80%)</option>
            <option value="critical">Critical (100%)</option>
            <option value="overage">Overage (120%)</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Subscription
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Manage your plan and billing
            </p>
          </div>

          {/* Past Due Warning Banner */}
          {subscription.state === 'past_due' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900">
                  Payment failed - Action required
                </p>
                <p className="text-sm text-red-700 mt-0.5">
                  We were unable to process your payment. Please update your payment method to avoid service interruption.
                </p>
              </div>
            </div>
          )}

          {/* Main Content - Vertical Layout */}
          <div className="space-y-8">
            {/* Current Plan */}
            <CurrentPlanCard
              subscription={subscription}
              plan={currentPlan}
              onManagePayment={handleManagePayment}
              onCancelSubscription={handleCancelSubscription}
              onUpgrade={() => handleUpgrade('starter')}
            />

            {/* Usage Progress */}
            {subscription.state !== 'expired' && (
              <UsageProgressCard
                subscription={subscription}
                usage={usage}
                plan={currentPlan}
              />
            )}

            {/* Plan Comparison */}
            <PlanComparisonCard
              currentTier={subscription.planTier}
              plans={Object.values(SUBSCRIPTION_PLANS)}
              onUpgrade={handleUpgrade}
              onContactSales={handleContactSales}
            />

            {/* Billing History */}
            <BillingHistoryCard
              invoices={invoices}
              onViewInvoice={handleViewInvoice}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {targetPlan && (
        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          currentPlan={currentPlan}
          targetPlan={SUBSCRIPTION_PLANS[targetPlan]}
          prorateAmount={calculateProrateAmount(
            currentPlan.price,
            SUBSCRIPTION_PLANS[targetPlan].price,
            getDaysRemaining(subscription.currentPeriodEnd)
          )}
          daysRemaining={getDaysRemaining(subscription.currentPeriodEnd)}
          onConfirm={confirmUpgrade}
        />
      )}

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={confirmCancel}
        currentPlan={currentPlan}
        serviceEndDate={subscription.currentPeriodEnd}
      />
    </div>
  );
};

export default SubscriptionPage;
