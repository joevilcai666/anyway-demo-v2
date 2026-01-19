import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check,
  AlertCircle,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  PricingAssistantState,
  PricingAssistantFormData,
  PricingRecommendation,
} from '../types';
import { formatCurrency } from '../utils';

interface PricingAssistantProps {
  currentState: PricingAssistantState;
  formData: PricingAssistantFormData;
  recommendation?: PricingRecommendation;
  error?: { message: string; details?: string };
  traceCostData?: { has_data: boolean; avg_cost: number; count: number; period_days: number };
  onFormChange: (data: PricingAssistantFormData) => void;
  onSubmit: () => Promise<void>;
  onApplyPrice: (priceType: 'min' | 'typical' | 'max') => void;
  onRegenerate: () => void;
  onDismiss: () => void;
}

export const PricingAssistant: React.FC<PricingAssistantProps> = ({
  currentState,
  formData,
  recommendation,
  error,
  traceCostData,
  onFormChange,
  onSubmit,
  onApplyPrice,
  onRegenerate,
  onDismiss,
}) => {
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [assumptionsExpanded, setAssumptionsExpanded] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Handle loading timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (currentState === 'loading') {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000); // 10 seconds
    } else {
      setLoadingTimeout(false);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentState]);

  const canSubmit = !!(
    formData.target_customer_type && formData.use_case_category
  );

  const handleCancelRequest = () => {
    // In a real app, this would cancel the actual API request
    onDismiss();
  };

  const getConfidenceBadgeColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-amber-50/30 border border-neutral-200 shadow-sm rounded-xl p-5">
      {/* State 1: Empty State */}
      {currentState === 'empty' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Lightbulb className="w-6 h-6 text-amber-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800 mb-1">
                Pricing Assistant
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Not sure what to charge? Let our AI help you set the right price.
              </p>
            </div>
          </div>
          <button
            disabled
            className="w-full py-2.5 px-4 bg-neutral-100 text-neutral-400 border border-neutral-200 rounded-lg text-sm font-medium cursor-not-allowed transition-colors"
          >
            Get pricing suggestion
          </button>
          <p className="text-xs text-neutral-500 text-center italic">
            Answer 2 quick questions to get personalized recommendations
          </p>
        </div>
      )}

      {/* State 2 & 3: Form State (with optional Advanced Options) */}
      {(currentState === 'form' || currentState === 'advanced') && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <h3 className="text-base font-semibold text-neutral-800 mb-4">
              Pricing Assistant
            </h3>
            <div className="space-y-4">
              {/* Target Customer Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Target customer type <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'individual_or_small_team', label: 'Individual/Small team' },
                    { value: 'small_business', label: 'Small Business (10-50 people)' },
                    { value: 'growth_enterprise', label: 'Growth Enterprise (50+ people)' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 cursor-pointer hover:bg-white hover:border-neutral-300 transition-all has-[:checked]:bg-amber-50 has-[:checked]:border-amber-300"
                    >
                      <input
                        type="radio"
                        name="customer_type"
                        value={option.value}
                        checked={formData.target_customer_type === option.value}
                        onChange={(e) =>
                          onFormChange({
                            ...formData,
                            target_customer_type: e.target.value as any,
                          })
                        }
                        className="w-4 h-4 text-amber-600 focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-sm text-neutral-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Use Case Category */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Use case category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.use_case_category || ''}
                  onChange={(e) =>
                    onFormChange({ ...formData, use_case_category: e.target.value })
                  }
                  placeholder="E.g., Weekly business analytics"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-400"
                />
              </div>

              {/* Advanced Options */}
              <div>
                <button
                  type="button"
                  onClick={() => setAdvancedExpanded(!advancedExpanded)}
                  className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-700 transition-colors py-1"
                >
                  {advancedExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  Advanced options
                </button>

                {advancedExpanded && (
                  <div className="mt-3 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Cost Information */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-neutral-700">
                        Cost information (optional)
                      </h4>

                      {/* Use My Actual Costs Checkbox */}
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.use_trace_cost_reference}
                          onChange={(e) =>
                            onFormChange({
                              ...formData,
                              use_trace_cost_reference: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-amber-600 mt-0.5 focus:ring-2 focus:ring-amber-500 rounded"
                        />
                        <div className="flex-1">
                          <span className="text-sm text-neutral-700">Use my actual costs</span>
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            We'll use your workflow cost data to calculate profitable pricing
                          </p>
                        </div>
                      </label>

                      {/* Trace Cost Display or No Cost Data */}
                      {formData.use_trace_cost_reference && (
                        <div className="ml-6">
                          {traceCostData?.has_data ? (
                            <div className="bg-white border border-neutral-200 rounded-lg p-3 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-neutral-500">Average cost:</span>
                                <span className="text-xs font-mono font-semibold text-neutral-700">
                                  {formatCurrency(traceCostData.avg_cost)} per delivery
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-neutral-500">Based on:</span>
                                <span className="text-[10px] text-neutral-700">
                                  {traceCostData.count} traces
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-neutral-500">Period:</span>
                                <span className="text-[10px] text-neutral-700">
                                  Last {traceCostData.period_days} days
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-blue-800">
                                  No cost data yet
                                </p>
                                <p className="text-[10px] text-blue-700 mt-0.5">
                                  We don't have your workflow cost data. Tell us your estimated cost per delivery to get better recommendations.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Manual Cost Input */}
                      <div className="ml-6">
                        <label className="block text-[10px] text-neutral-500 mb-1">
                          Or enter manual estimate:
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            value={formData.manual_cost || ''}
                            onChange={(e) =>
                              onFormChange({
                                ...formData,
                                manual_cost: parseFloat(e.target.value) || undefined,
                              })
                            }
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full pl-7 pr-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-400"
                          />
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Estimated cost per delivery
                        </p>
                      </div>
                    </div>

                    {/* Value Type */}
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-700 mb-2">
                        Value type (optional)
                      </h4>
                      <p className="text-[10px] text-neutral-500 mb-2">Select all that apply</p>
                      <div className="space-y-2">
                        {[
                          { value: 'save_time', label: 'Save time' },
                          { value: 'increase_revenue', label: 'Increase revenue' },
                          { value: 'reduce_cost', label: 'Reduce cost' },
                          { value: 'other', label: 'Other' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer hover:text-neutral-900"
                          >
                            <input
                              type="checkbox"
                              checked={formData.value_types?.includes(option.value as any)}
                              onChange={(e) => {
                                const current = formData.value_types || [];
                                const updated = e.target.checked
                                  ? [...current, option.value as any]
                                  : current.filter((v) => v !== option.value);
                                onFormChange({ ...formData, value_types: updated });
                              }}
                              className="w-4 h-4 text-amber-600 focus:ring-2 focus:ring-amber-500 rounded"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`
              w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all
              ${
                canSubmit
                  ? 'bg-white border border-neutral-300 text-neutral-900 hover:bg-neutral-50 hover:border-neutral-400 shadow-sm hover:shadow cursor-pointer'
                  : 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
              }
            `}
          >
            Get pricing suggestion
          </button>
        </div>
      )}

      {/* State 4: Loading State */}
      {currentState === 'loading' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-center py-8">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-200"></div>
              <Loader2 className="absolute inset-0 w-16 h-16 text-amber-600 animate-spin" strokeWidth={3} />
            </div>
            <p className="text-sm font-medium text-neutral-700 animate-pulse">
              Thinking about your price…
            </p>
            {!loadingTimeout ? (
              <p className="text-xs text-neutral-500 mt-2">This usually takes 3-5 seconds.</p>
            ) : (
              <div className="mt-4">
                <p className="text-xs text-orange-600 font-medium">Taking longer than expected…</p>
                <button
                  onClick={handleCancelRequest}
                  className="mt-2 text-xs text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* State 5: Success State */}
      {currentState === 'success' && recommendation && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Success Header */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-emerald-700">
                Pricing suggestion ready
              </h3>
              <div className={`inline-block px-2 py-0.5 rounded-full border text-xs font-medium mt-1 ${getConfidenceBadgeColor(recommendation.confidence_level)}`}>
                {recommendation.confidence_level} confidence
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <p className="text-xs font-semibold text-neutral-700 mb-3">
              Recommended price range
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'min', price: recommendation.recommended_min_price, label: 'Min' },
                { type: 'typical', price: recommendation.recommended_typical_price, label: 'Typical' },
                { type: 'max', price: recommendation.recommended_max_price, label: 'Max' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => onApplyPrice(item.type as any)}
                  className="group flex flex-col items-center gap-2 p-3 bg-white border border-neutral-200 rounded-lg hover:border-amber-300 hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-medium text-neutral-500 uppercase">
                    {item.label}
                  </span>
                  <span className="text-lg font-bold font-mono text-neutral-900 group-hover:scale-105 transition-transform">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded border border-neutral-300 text-neutral-600 group-hover:bg-amber-50 group-hover:border-amber-300 group-hover:text-amber-700 transition-colors">
                    Apply {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Assumptions (Collapsible) */}
          <div className="border-t border-neutral-200 pt-3">
            <button
              onClick={() => setAssumptionsExpanded(!assumptionsExpanded)}
              className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-700 transition-colors w-full"
            >
              {assumptionsExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              Assumptions
            </button>
            {assumptionsExpanded && (
              <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                <div>
                  <p className="text-xs font-semibold text-neutral-700 mb-1">Assumptions:</p>
                  <ul className="space-y-1">
                    {recommendation.assumptions.map((assumption, idx) => (
                      <li key={idx} className="text-[10px] text-neutral-600 flex gap-1">
                        <span className="font-medium">•</span>
                        <span>
                          <span className="font-medium text-neutral-700">{assumption.title}:</span>{' '}
                          {assumption.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-700 mb-1">Rationale:</p>
                  <ul className="space-y-1">
                    {recommendation.rationale.map((rationale, idx) => (
                      <li key={idx} className="text-[10px] text-neutral-600 flex gap-1">
                        <span className="font-medium">•</span>
                        <span>
                          <span className="font-medium text-neutral-700">{rationale.title}:</span>{' '}
                          {rationale.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Regenerate Button */}
          <button
            onClick={onRegenerate}
            className="w-full py-2 px-4 border border-neutral-300 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            Regenerate suggestion
          </button>
        </div>
      )}

      {/* State 6: Error State */}
      {currentState === 'error' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Error Header */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" strokeWidth={2} />
            </div>
            <h3 className="text-base font-semibold text-orange-700">
              Unable to generate suggestion
            </h3>
          </div>

          {/* Error Message Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              {error?.message || 'Something went wrong. Please try again or set your price manually.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onSubmit}
              className="flex-1 py-2 px-4 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
            >
              Try again
            </button>
            <button
              onClick={onDismiss}
              className="flex-1 py-2 px-4 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            >
              Dismiss
            </button>
          </div>

          {/* Manual Pricing Guidance */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              You can still set your price manually in the form on the left.
            </p>
          </div>

          {/* Preserve Form Data Display */}
          <div className="border-t border-neutral-200 pt-3">
            <p className="text-[10px] text-neutral-500 mb-2">Your information:</p>
            <div className="space-y-1 text-[10px] text-neutral-600">
              <p><span className="font-medium">Customer type:</span> {formData.target_customer_type?.replace('_', ' ')}</p>
              <p><span className="font-medium">Use case:</span> {formData.use_case_category}</p>
            </div>
          </div>
        </div>
      )}

      {/* State 7: No Cost Data State (integrated in Advanced) */}
      {currentState === 'no_cost' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-blue-800">
                No cost data yet
              </p>
              <p className="text-[10px] text-blue-700 mt-0.5">
                We don't have your cost data yet. Tell us your estimated cost per delivery to get better recommendations.
              </p>
            </div>
          </div>
          <button
            onClick={onSubmit}
            className="w-full py-2.5 px-4 bg-white border border-neutral-300 text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
          >
            Get pricing suggestion
          </button>
        </div>
      )}

      {/* State 8: Out of Date State */}
      {currentState === 'out_of_date' && recommendation && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Out of Date Badge */}
          <div className="inline-block px-2 py-1 rounded bg-orange-100 text-orange-700 border border-orange-200 text-xs font-semibold">
            Out of date
          </div>

          {/* Previous Suggestion (with reduced opacity) */}
          <div className="opacity-60 pointer-events-none space-y-4">
            <div>
              <p className="text-xs font-semibold text-neutral-700 mb-3">
                Previous suggestion (outdated)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { price: recommendation.recommended_min_price, label: 'Min' },
                  { price: recommendation.recommended_typical_price, label: 'Typical' },
                  { price: recommendation.recommended_max_price, label: 'Max' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-2 p-3 bg-white border border-neutral-200 rounded-lg"
                  >
                    <span className="text-[10px] font-medium text-neutral-500 uppercase">
                      {item.label}
                    </span>
                    <span className="text-lg font-bold font-mono text-neutral-900">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded border border-neutral-300 text-neutral-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regenerate Button */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-900 mb-2">
              You've updated your inputs. Generate a new suggestion for updated pricing.
            </p>
            <button
              onClick={onRegenerate}
              className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Regenerate suggestion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
