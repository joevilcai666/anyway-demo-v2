import React from 'react';
import { RevenueModel } from '../types';
import { DollarSign, Repeat, BarChart3, Check } from 'lucide-react';

interface RevenueModelSelectorProps {
  selectedModel: RevenueModel | null;
  onSelect: (model: RevenueModel) => void;
  disabled?: boolean;
}

const models = [
  {
    id: 'one_time' as RevenueModel,
    title: 'One-time payment',
    description: 'Charge once for a single delivery or service',
    example: 'Perfect for: One-off reports, consultations, single-use tools',
    icon: DollarSign,
    gradient: 'from-amber-50 to-orange-50',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'subscription' as RevenueModel,
    title: 'Subscription',
    description: 'Recurring payments for ongoing access or service',
    example: 'Perfect for: Weekly reports, monthly analytics, ongoing support',
    icon: Repeat,
    gradient: 'from-blue-50 to-indigo-50',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'usage_based' as RevenueModel,
    title: 'Usage-based',
    description: 'Charge based on how much your customers use',
    example: 'Perfect for: API calls, token consumption, per-run executions',
    icon: BarChart3,
    gradient: 'from-emerald-50 to-teal-50',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
];

export const RevenueModelSelector: React.FC<RevenueModelSelectorProps> = ({
  selectedModel,
  onSelect,
  disabled = false,
}) => {
  const handleCardClick = (model: RevenueModel) => {
    if (!disabled) {
      onSelect(model);
      // Auto-scroll to expanded fields after brief delay for animation
      setTimeout(() => {
        const cardElement = document.getElementById(`model-${model}`);
        cardElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  return (
    <div className="space-y-3" role="radiogroup">
      {models.map((model) => {
        const isSelected = selectedModel === model.id;
        const Icon = model.icon;

        return (
          <button
            key={model.id}
            id={`model-${model.id}`}
            type="button"
            onClick={() => handleCardClick(model.id)}
            disabled={disabled}
            className={`
              group relative w-full text-left rounded-xl border-2 p-5
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${
                isSelected
                  ? 'border-amber-400 bg-gradient-to-br shadow-lg shadow-amber-100/50'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5'
              }
              ${model.gradient}
            `}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={disabled}
          >
            {/* Selection indicator */}
            <div className="flex items-start gap-4">
              {/* Icon container */}
              <div
                className={`
                  flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                  transition-all duration-200
                  ${isSelected ? 'scale-110 shadow-md' : 'scale-100 opacity-80 group-hover:scale-105 group-hover:opacity-100'}
                  ${model.iconBg}
                `}
              >
                <Icon className="w-6 h-6" strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`
                      font-semibold transition-colors
                      ${isSelected ? 'text-neutral-900' : 'text-neutral-700'}
                    `}
                  >
                    {model.title}
                  </h3>
                  {isSelected && (
                    <Check
                      className="w-5 h-5 text-amber-600 animate-in fade-in zoom-in duration-200"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
                <p
                  className={`
                    text-sm mb-2 leading-relaxed
                    ${isSelected ? 'text-neutral-600' : 'text-neutral-500'}
                  `}
                >
                  {model.description}
                </p>
                <p
                  className={`
                    text-xs font-medium
                    ${isSelected ? 'text-neutral-500' : 'text-neutral-400'}
                  `}
                >
                  {model.example}
                </p>
              </div>
            </div>

            {/* Animated corner accent for selected state */}
            {isSelected && (
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-amber-400 opacity-20 rounded-bl-full" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
