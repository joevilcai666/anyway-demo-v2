import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Tag,
} from 'lucide-react';
import { RevenueModel, PricingAssistantState, PricingAssistantFormData, PricingRecommendation } from '../types';
import { RevenueModelSelector } from '../components/RevenueModelSelector';
import { PricingAssistant } from '../components/PricingAssistant';
import { DraftSaveIndicator, useDraftAutoSave } from '../components/DraftSaveIndicator';
import { formatPrice, generatePricingRecommendation, copyToClipboard, validateProductName, validatePriceAmount, validateUnitName } from '../utils';

interface PaymentLinkWizardProps {
  productId: string;
  productName?: string;
  onBack: () => void;
  onComplete: (linkId: string) => void;
}

type Step = 'price_config' | 'generate_link';

const StepIndicator: React.FC<{ currentStep: Step }> = ({ currentStep }) => {
  const steps: { id: Step; label: string }[] = [
    { id: 'price_config', label: 'Price Configuration' },
    { id: 'generate_link', label: 'Payment Link' },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-neutral-200 -z-10" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-900 -z-10 transition-all duration-300"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-[#FAFAFA] px-2">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                  ${isCompleted
                    ? 'bg-neutral-900 border-neutral-900 text-white'
                    : isCurrent
                      ? 'bg-white border-neutral-900 text-neutral-900'
                      : 'bg-white border-neutral-300 text-neutral-300'}
                `}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : idx + 1}
              </div>
              <span
                className={`
                  text-xs font-medium absolute -bottom-6 w-32 text-center
                  ${isCurrent ? 'text-neutral-900' : 'text-neutral-400'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PaymentLinkWizard: React.FC<PaymentLinkWizardProps> = ({ productId, productName, onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>('price_config');

  // Form State
  const [formData, setFormData] = useState({
    priceName: '',
    linkName: '',
    revenueModel: 'one_time' as RevenueModel,
    priceAmount: '',
    billingPeriod: 'monthly' as 'monthly' | 'yearly',
    usageUnitName: '',
  });

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pricing Assistant State
  const [pricingAssistantState, setPricingAssistantState] = useState<PricingAssistantState>('empty');
  const [pricingFormData, setPricingFormData] = useState<PricingAssistantFormData>({});
  const [pricingRecommendation, setPricingRecommendation] = useState<PricingRecommendation>();
  const [pricingError, setPricingError] = useState<{ message: string; details?: string }>();

  // Payment Link State
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Auto-save draft
  const draftSave = useDraftAutoSave(
    formData,
    async (data) => {
      // Mock API call to save draft
      console.log('Saving payment link draft:', data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    },
    5000 // 5 second throttle
  );

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate price name
    const priceNameValidation = validateProductName(formData.priceName);
    if (!priceNameValidation.isValid) {
      newErrors.priceName = priceNameValidation.error!;
    }

    // Validate link name
    const linkNameValidation = validateProductName(formData.linkName);
    if (!linkNameValidation.isValid) {
      newErrors.linkName = linkNameValidation.error!;
    }

    // Validate price amount
    if (formData.priceAmount) {
      const priceValidation = validatePriceAmount(parseFloat(formData.priceAmount));
      if (!priceValidation.isValid) {
        newErrors.priceAmount = priceValidation.error!;
      }
    }

    // Validate unit name for usage-based
    if (formData.revenueModel === 'usage_based' && formData.usageUnitName) {
      const unitValidation = validateUnitName(formData.usageUnitName);
      if (!unitValidation.isValid) {
        newErrors.usageUnitName = unitValidation.error!;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle revenue model change
  const handleRevenueModelChange = (model: RevenueModel) => {
    setFormData((prev) => ({
      ...prev,
      revenueModel: model,
      priceAmount: '',
      usageUnitName: '',
    }));

    // Reset Pricing Assistant when model changes
    setPricingAssistantState('empty');
    setPricingRecommendation(undefined);
    setErrors({});
  };

  // Handle Pricing Assistant form change
  const handlePricingFormChange = (data: PricingAssistantFormData) => {
    setPricingFormData(data);
  };

  // Handle Pricing Assistant submit
  const handlePricingSubmit = async () => {
    setPricingAssistantState('loading');
    setPricingError(undefined);

    try {
      const recommendation = await generatePricingRecommendation(pricingFormData);
      setPricingRecommendation(recommendation);
      setPricingAssistantState('success');
    } catch (error) {
      setPricingError({
        message: 'Failed to generate pricing suggestion',
        details: error instanceof Error ? error.message : 'Please try again',
      });
      setPricingAssistantState('error');
    }
  };

  // Handle Apply Price from Pricing Assistant
  const handleApplyPrice = (priceType: 'min' | 'typical' | 'max') => {
    if (!pricingRecommendation) return;

    const price =
      priceType === 'min'
        ? pricingRecommendation.recommended_min_price
        : priceType === 'typical'
          ? pricingRecommendation.recommended_typical_price
          : pricingRecommendation.recommended_max_price;

    setFormData((prev) => ({ ...prev, priceAmount: price.toString() }));
    setErrors({});

    // Track which price type was applied
    setPricingRecommendation((prev) =>
      prev
        ? {
            ...prev,
            applied_price_type: priceType,
          }
        : undefined
    );

    // Smooth scroll to price field
    setTimeout(() => {
      const priceField = document.getElementById('price-amount-field');
      priceField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      priceField?.focus();
    }, 100);
  };

  // Handle Regenerate
  const handleRegenerate = () => {
    setPricingAssistantState('form');
    setPricingRecommendation(undefined);
  };

  // Handle Dismiss
  const handleDismiss = () => {
    setPricingAssistantState('empty');
    setPricingFormData({});
    setPricingRecommendation(undefined);
  };

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep('generate_link');
    }
  };

  const handleBack = () => {
    if (currentStep === 'price_config') {
      onBack();
    } else {
      setCurrentStep('price_config');
    }
  };

  const generatePaymentLink = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedLink(`https://pay.anyway.ai/p/${Math.random().toString(36).substr(2, 9)}`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyLink = async () => {
    if (generatedLink) {
      const success = await copyToClipboard(generatedLink);
      if (success) {
        setCopiedToClipboard(true);
        setTimeout(() => setCopiedToClipboard(false), 2000);
      }
    }
  };

  // --- Render Steps ---

  const renderStep1 = () => (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Column: Main Form (65%) */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Price Configuration</h2>
          <p className="text-neutral-500">
            {productName ? `Creating payment link for "${productName}"` : 'Configure your price and link'}
          </p>
        </div>

        <div className="space-y-8">
          {/* Price Name */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-neutral-500" />
                Price name <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.priceName}
              onChange={(e) => setFormData({ ...formData, priceName: e.target.value })}
              placeholder="e.g. Basic Tier, Pro Tier, Enterprise Plan"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
                errors.priceName ? 'border-red-300 bg-red-50' : 'border-neutral-300 bg-white'
              }`}
              autoFocus
            />
            {errors.priceName && <p className="mt-1.5 text-sm text-red-600">{errors.priceName}</p>}
            <p className="mt-1.5 text-sm text-neutral-500">
              A name to identify this price (e.g., "Basic Tier").
            </p>
          </div>

          {/* Link Name */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className="text-neutral-500" />
                Link name <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.linkName}
              onChange={(e) => setFormData({ ...formData, linkName: e.target.value })}
              placeholder="e.g. Twitter Campaign, Email Promo, Direct Purchase"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
                errors.linkName ? 'border-red-300 bg-red-50' : 'border-neutral-300 bg-white'
              }`}
            />
            {errors.linkName && <p className="mt-1.5 text-sm text-red-600">{errors.linkName}</p>}
            <p className="mt-1.5 text-sm text-neutral-500">
              A name to identify this payment link (e.g., "Twitter Campaign").
            </p>
          </div>

          {/* Revenue Model Selector */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              Revenue model <span className="text-red-500">*</span>
            </label>
            <RevenueModelSelector
              selectedModel={formData.revenueModel}
              onSelect={handleRevenueModelChange}
            />
          </div>

          {/* Price Configuration */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              Set your price
            </h3>

            {/* Price Amount */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {formData.revenueModel === 'usage_based' ? 'Unit price' : 'Price amount'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-lg">
                  $
                </span>
                <input
                  id="price-amount-field"
                  type="number"
                  value={formData.priceAmount}
                  onChange={(e) => {
                    setFormData({ ...formData, priceAmount: e.target.value });
                    if (errors.priceAmount) setErrors({ ...errors, priceAmount: undefined });
                  }}
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 py-4 text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono font-bold transition-all ${
                    errors.priceAmount ? 'border-red-300 bg-red-50' : 'border-neutral-300 bg-white'
                  }`}
                />
              </div>
              {errors.priceAmount && <p className="mt-1.5 text-sm text-red-600">{errors.priceAmount}</p>}

              {/* Billing period for subscription */}
              {formData.revenueModel === 'subscription' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Billing period
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['monthly', 'yearly'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setFormData({ ...formData, billingPeriod: period })}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all capitalize ${
                          formData.billingPeriod === period
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">Billed {formData.billingPeriod}</p>
                </div>
              )}

              {/* Unit name for usage-based */}
              {formData.revenueModel === 'usage_based' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Unit name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.usageUnitName}
                    onChange={(e) => {
                      setFormData({ ...formData, usageUnitName: e.target.value });
                      if (errors.usageUnitName) setErrors({ ...errors, usageUnitName: undefined });
                    }}
                    placeholder="e.g. API call, 1K tokens, run"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all ${
                      errors.usageUnitName ? 'border-red-300 bg-red-50' : 'border-neutral-300 bg-white'
                    }`}
                  />
                  {errors.usageUnitName && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.usageUnitName}</p>
                  )}
                  <p className="mt-1.5 text-sm text-neutral-500">
                    Customers will be charged per {formData.usageUnitName || 'unit'}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Draft Save Indicator */}
          <div className="pt-4">
            <DraftSaveIndicator
              status={draftSave.status}
              lastSaved={draftSave.lastSaved}
              errorMessage={draftSave.errorMessage}
              onRetry={draftSave.retry}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Pricing Assistant (35%) */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <PricingAssistant
            currentState={pricingAssistantState}
            formData={pricingFormData}
            recommendation={pricingRecommendation}
            error={pricingError}
            onFormChange={handlePricingFormChange}
            onSubmit={handlePricingSubmit}
            onApplyPrice={handleApplyPrice}
            onRegenerate={handleRegenerate}
            onDismiss={handleDismiss}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <LinkIcon size={32} strokeWidth={2} />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Almost there!</h2>
        <p className="text-neutral-500">Review and generate your payment link.</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Summary</h3>

            <div className="space-y-3">
              {/* Price Name */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Price name
                </label>
                <p className="text-base font-semibold text-neutral-900">{formData.priceName || 'Untitled Price'}</p>
              </div>

              {/* Link Name */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Link name
                </label>
                <p className="text-base font-semibold text-neutral-900">{formData.linkName || 'Untitled Link'}</p>
              </div>

              {/* Revenue Model Badge */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Revenue model
                </label>
                <p className="text-base font-medium text-neutral-700 capitalize mt-1">
                  {formData.revenueModel.replace('_', ' ')}
                </p>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Price
                </label>
                <p className="text-2xl font-mono font-bold text-neutral-900">
                  ${formData.priceAmount || '0.00'}
                  {formData.revenueModel === 'subscription' && (
                    <span className="text-base font-sans font-normal text-neutral-600">
                      /{formData.billingPeriod}
                    </span>
                  )}
                  {formData.revenueModel === 'usage_based' && formData.usageUnitName && (
                    <span className="text-base font-sans font-normal text-neutral-600">
                      /{formData.usageUnitName}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Link Section */}
      <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm space-y-6">
        {!generatedLink ? (
          <div className="space-y-4">
            <button
              onClick={generatePaymentLink}
              disabled={isGenerating}
              className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2 text-base"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating link…
                </>
              ) : (
                <>
                  <LinkIcon size={20} />
                  Generate payment link
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            {/* Success Message */}
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm flex items-center gap-3">
              <Check size={20} className="shrink-0" />
              <div>
                <p className="font-semibold">Payment link created!</p>
                <p className="text-emerald-700 mt-0.5">Your link is ready to share.</p>
              </div>
            </div>

            {/* Link Display */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2 text-left">
                Payment link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-mono text-sm text-neutral-600 truncate text-left">
                  {generatedLink}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="p-3 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600 transition-all hover:border-neutral-300"
                  title={copiedToClipboard ? 'Copied!' : 'Copy'}
                >
                  {copiedToClipboard ? <Check size={20} className="text-emerald-600" /> : <Copy size={20} />}
                </button>
                <button
                  className="p-3 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600 transition-all hover:border-neutral-300"
                  title="Open"
                  onClick={() => window.open(generatedLink, '_blank')}
                >
                  <ExternalLink size={20} />
                </button>
              </div>
            </div>

            {/* Product Context */}
            {productName && (
              <div className="pt-4 border-t border-neutral-100">
                <p className="text-sm text-neutral-600">
                  This link is for <strong className="text-neutral-900">{productName}</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-neutral-900">Create Payment Link</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Cancel
            </button>
            {currentStep !== 'generate_link' && (
              <button
                onClick={handleNext}
                disabled={!formData.priceName || !formData.linkName || !formData.priceAmount}
                className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                Next Step
                <ChevronRight size={16} />
              </button>
            )}
            {currentStep === 'generate_link' && generatedLink && (
              <button
                onClick={() => onComplete('link_123')}
                className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-all"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto py-8 px-6">
        <StepIndicator currentStep={currentStep} />

        <div className="pb-20">{currentStep === 'price_config' ? renderStep1() : renderStep2()}</div>
      </main>
    </div>
  );
};

export default PaymentLinkWizard;
