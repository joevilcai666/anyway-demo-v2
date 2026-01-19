import React from 'react';
import { RevenueModel } from '../types';
import { formatPrice } from '../utils';
import { Check, Circle, DollarSign, Repeat, BarChart3, FileText } from 'lucide-react';

interface ProductSummaryCardProps {
  name: string;
  revenueModel: RevenueModel;
  priceAmount: number;
  billingPeriod?: 'monthly' | 'yearly'; // For subscription
  usageUnitName?: string; // For usage-based
  status: 'draft' | 'published' | 'archived';
  onEdit?: () => void;
  className?: string;
}

// Badge color configurations
const getRevenueBadgeConfig = (model: RevenueModel) => {
  switch (model) {
    case 'one_time':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: DollarSign,
      };
    case 'subscription':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: Repeat,
      };
    case 'usage_based':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: BarChart3,
      };
  }
};

const getStatusBadgeConfig = (status: 'draft' | 'published' | 'archived') => {
  switch (status) {
    case 'draft':
      return {
        bg: 'bg-neutral-100',
        text: 'text-neutral-600',
        border: 'border-neutral-300',
        icon: Circle,
      };
    case 'published':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: Check,
      };
    case 'archived':
      return {
        bg: 'bg-neutral-50',
        text: 'text-neutral-500',
        border: 'border-neutral-200',
        icon: FileText,
      };
  }
};

// Build a Price object for formatting
const buildPriceObject = (
  amount: number,
  revenueModel: RevenueModel,
  billingPeriod?: 'monthly' | 'yearly',
  usageUnitName?: string
) => ({
  unit_amount: amount,
  revenue_model: revenueModel,
  billing_period: billingPeriod || 'monthly',
  usage_unit_name: usageUnitName,
});

export const ProductSummaryCard: React.FC<ProductSummaryCardProps> = ({
  name,
  revenueModel,
  priceAmount,
  billingPeriod,
  usageUnitName,
  status,
  onEdit,
  className = '',
}) => {
  const revenueBadge = getRevenueBadgeConfig(revenueModel);
  const statusBadge = getStatusBadgeConfig(status);
  const RevenueIcon = revenueBadge.icon;
  const StatusIcon = statusBadge.icon;

  const priceObj = buildPriceObject(priceAmount, revenueModel, billingPeriod, usageUnitName);
  const formattedPrice = formatPrice(priceObj as any);

  return (
    <div
      className={`
        relative bg-white border border-neutral-200 rounded-xl shadow-sm p-6
        transition-all duration-300 ease-out
        hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5
        animate-in fade-in slide-in-from-bottom-4 duration-500
        ${className}
      `}
    >
      {/* Subtle decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-xl opacity-30">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-neutral-100 to-transparent rounded-bl-full" />
      </div>

      {/* Header with title and edit link */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Summary</h2>
          <p className="text-sm text-neutral-500">Review your product details before generating the payment link</p>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm font-medium text-amber-600 hover:text-amber-700 underline underline-offset-2 decoration-amber-600/30 hover:decoration-amber-600 transition-all duration-200"
          >
            Edit details
          </button>
        )}
      </div>

      {/* Summary fields */}
      <div className="space-y-4">
        {/* Product Name */}
        <div className="group">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1 block">
            Product name
          </label>
          <p className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-800 transition-colors">
            {name}
          </p>
        </div>

        {/* Revenue Model Badge */}
        <div>
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1.5 block">
            Revenue model
          </label>
          <div
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border
              ${revenueBadge.bg} ${revenueBadge.text} ${revenueBadge.border}
              transition-all duration-200
              hover:shadow-sm hover:scale-105
            `}
          >
            <RevenueIcon className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm font-medium capitalize">
              {revenueModel.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="group">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1 block">
            Price
          </label>
          <p className="text-2xl font-mono font-semibold text-neutral-900 group-hover:text-neutral-800 transition-colors">
            {formattedPrice}
          </p>
        </div>

        {/* Status Badge */}
        <div>
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1.5 block">
            Status
          </label>
          <div
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border
              ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}
              transition-all duration-200
              hover:shadow-sm hover:scale-105
            `}
          >
            <StatusIcon className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm font-medium capitalize">
              {status === 'draft' ? 'Draft' : status === 'published' ? 'Published' : 'Archived'}
            </span>
          </div>
        </div>
      </div>

      {/* Subtle bottom border accent */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neutral-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
