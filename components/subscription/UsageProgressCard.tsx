import React from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { Subscription, Usage } from '../../types';
import { formatCurrency, getUsageWarning } from '../../utils';
import ProgressBar from './ProgressBar';
import Button from '../Button';

interface UsageProgressCardProps {
  subscription: Subscription;
  usage: Usage;
  plan: any; // Plan type
}

const UsageProgressCard: React.FC<UsageProgressCardProps> = ({
  subscription,
  usage,
  plan,
}) => {
  const warning = getUsageWarning(usage);
  const currentUnits = usage.currentPeriod.computeUnits;
  const maxUnits = plan.limits.computeUnits;
  const isUnlimited = maxUnits === Infinity;

  // Calculate overage if applicable
  const overageUnits = currentUnits - maxUnits;
  const overageCost = overageUnits > 0 && plan.overageRate ? overageUnits * plan.overageRate : 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Usage This Billing Cycle
      </h3>

      {/* Usage display */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-600">
            {isUnlimited ? (
              <>Compute units: {currentUnits.toLocaleString()} used</>
            ) : (
              <>Compute units: {currentUnits.toLocaleString()} / {maxUnits.toLocaleString()} used</>
            )}
          </span>
          <span className="text-sm font-medium text-neutral-900">
            {usage.percentageUsed.toFixed(1)}%
          </span>
        </div>

        {/* Progress bar */}
        {!isUnlimited && (
          <ProgressBar
            percentage={usage.percentageUsed}
            warningThreshold={80}
            size="md"
          />
        )}
      </div>

      {/* Warning message */}
      {warning && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
            warning.severity === 'critical'
              ? 'bg-red-50 border border-red-200'
              : 'bg-amber-50 border border-amber-200'
          }`}
        >
          <AlertCircle
            size={16}
            className={`flex-shrink-0 mt-0.5 ${
              warning.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
            }`}
          />
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                warning.severity === 'critical' ? 'text-red-900' : 'text-amber-900'
              }`}
            >
              {warning.severity === 'critical' ? 'Usage limit exceeded' : 'Usage warning'}
            </p>
            <p
              className={`text-sm mt-0.5 ${
                warning.severity === 'critical' ? 'text-red-700' : 'text-amber-700'
              }`}
            >
              {warning.message}
            </p>
          </div>
        </div>
      )}

      {/* Overage info */}
      {overageUnits > 0 && plan.overageRate && (
        <div className="mb-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
          <p className="text-sm font-medium text-neutral-900">Overage charges</p>
          <p className="text-sm text-neutral-600 mt-0.5">
            {overageUnits.toLocaleString()} units over limit × {formatCurrency(plan.overageRate)} ={' '}
            <span className="font-semibold text-neutral-900">{formatCurrency(overageCost)}</span>
          </p>
        </div>
      )}

      {/* Predicted usage */}
      {usage.predicted.computeUnits > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm text-neutral-600">
          <TrendingUp size={16} />
          <span>
            Estimated this month: <span className="font-medium text-neutral-900">{usage.predicted.computeUnits.toLocaleString()} units</span>
          </span>
        </div>
      )}

      {/* Action link */}
      <Button variant="ghost" size="sm" onClick={() => alert('View usage details')}>
        View Usage Details
      </Button>
    </div>
  );
};

export default UsageProgressCard;
