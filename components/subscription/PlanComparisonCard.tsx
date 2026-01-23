import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { PlanTier } from '../../types';
import { formatCurrency } from '../../utils';
import Button from '../Button';

interface PlanComparisonCardProps {
  currentTier: PlanTier;
  plans: any[];
  onUpgrade: (tier: PlanTier) => void;
  onContactSales: () => void;
}

const PlanComparisonCard: React.FC<PlanComparisonCardProps> = ({
  currentTier,
  plans,
  onUpgrade,
  onContactSales,
}) => {
  // Filter plans: only show Free, Starter, Pro (remove Enterprise for MVP)
  const mvpPlans = plans.filter((plan) =>
    ['free', 'starter', 'pro'].includes(plan.tier)
  );

  // Track expanded state for each plan's benefits
  const [expandedPlans, setExpandedPlans] = useState<Set<PlanTier>>(new Set());

  const toggleExpanded = (tier: PlanTier) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(tier)) {
      newExpanded.delete(tier);
    } else {
      newExpanded.add(tier);
    }
    setExpandedPlans(newExpanded);
  };

  const tierOrder: Record<PlanTier, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    enterprise: 3,
  };

  const isCurrentOrHigher = (tier: PlanTier) => {
    return tierOrder[tier] >= tierOrder[currentTier];
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Plan Comparison
      </h3>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mvpPlans.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          const isHigher = tierOrder[plan.tier] > tierOrder[currentTier];
          const isExpanded = expandedPlans.has(plan.tier);

          return (
            <div
              key={plan.tier}
              className={`border rounded-xl overflow-hidden transition-all ${
                isCurrent
                  ? 'border-neutral-200 bg-neutral-50'
                  : 'border-neutral-200 hover:border-brand-yellow hover:shadow-md'
              }`}
            >
              {/* Plan Header */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-neutral-900">{plan.name}</h4>
                  {isCurrent && (
                    <span className="text-xs font-medium text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-2xl font-mono font-bold text-neutral-900">
                  {plan.price > 0 ? formatCurrency(plan.price) : 'Free'}
                  <span className="text-sm font-normal text-neutral-500">
                    /{plan.billingPeriod}
                  </span>
                </p>
              </div>

              {/* Benefits Section */}
              <div className="border-t border-neutral-200">
                {/* Benefits Preview (first 3) */}
                <div className="p-4 pb-0">
                  <ul className="space-y-2">
                    {plan.features.slice(0, 3).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                        <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expandable Remaining Benefits */}
                {plan.features.length > 3 && (
                  <div className="px-4">
                    {/* Collapsible Content */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ease-in-out ${
                        isExpanded ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <ul className="space-y-2 py-2">
                        {plan.features.slice(3).map((feature: string, index: number) => (
                          <li key={index + 3} className="flex items-start gap-2 text-sm text-neutral-600">
                            <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleExpanded(plan.tier)}
                      className="w-full flex items-center justify-center gap-1 py-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <span>Show less</span>
                          <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          <span>Show all {plan.features.length} features</span>
                          <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Action Button */}
                <div className="p-4 pt-2">
                  {isCurrent ? (
                    <Button variant="secondary" size="sm" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : isHigher ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => onUpgrade(plan.tier)}
                    >
                      Upgrade to {plan.name}
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" className="w-full" disabled>
                      Downgrade unavailable
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanComparisonCard;
