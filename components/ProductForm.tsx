import React, { useState, useEffect } from 'react';
import { Product, RevenueModel, PricingAssistantState, PricingAssistantFormData, PricingRecommendation } from '../types';
import { RevenueModelSelector } from './RevenueModelSelector';
import { PricingAssistant } from './PricingAssistant';
import { DraftSaveIndicator, useDraftAutoSave } from './DraftSaveIndicator';
import { validateProductName, validatePriceAmount, validateUnitName } from '../utils';

export type ProductFormMode = 'create' | 'edit' | 'create-link';

export interface ProductFormProps {
  mode: ProductFormMode;
  // Common props
  initialData?: {
    name?: string;
    description?: string;
    revenueModel?: RevenueModel;
    priceAmount?: string;
    billingPeriod?: 'monthly' | 'yearly';
    usageUnitName?: string;
  };
  // Props for create-link mode
  productName?: string; // For displaying in create-link mode
  priceName?: string;
  linkName?: string;
  // Callbacks
  onSubmit?: (data: ProductFormData) => void;
  onBack?: () => void;
  onCancel?: () => void;
  // Draft auto-save (only for create and create-link modes)
  enableDraftSave?: boolean;
}

export interface ProductFormData {
  // Product fields
  name: string;
  description: string;
  revenueModel: RevenueModel;
  // Price fields
  priceAmount: string;
  billingPeriod: 'monthly' | 'yearly';
  usageUnitName: string;
  // Payment link fields (only for create-link mode)
  priceName: string;
  linkName: string;
}

// Helper to get page title by mode
export const getPageTitle = (mode: ProductFormMode): string => {
  switch (mode) {
    case 'create':
      return 'Create New Product';
    case 'edit':
      return 'Edit Product';
    case 'create-link':
      return 'New Payment Link';
  }
};

// Helper to get primary button text by mode
export const getPrimaryButtonText = (mode: ProductFormMode): string => {
  switch (mode) {
    case 'create':
      return 'Publish & Generate Link';
    case 'edit':
      return 'Save Changes';
    case 'create-link':
      return 'Create Link';
  }
};

// Helper to check if field is readonly by mode
const isFieldReadOnly = (mode: ProductFormMode, field: keyof ProductFormData): boolean => {
  switch (field) {
    case 'name':
    case 'description':
      return mode === 'create-link';
    case 'revenueModel':
      return mode === 'edit'; // Allow changing in create-link mode
    case 'priceAmount':
      return mode === 'edit';
    case 'priceName':
    case 'linkName':
      return mode !== 'create-link';
    default:
      return false;
  }
};

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialData,
  productName,
  priceName: initialPriceName,
  linkName: initialLinkName,
  onSubmit,
  onBack,
  onCancel,
  enableDraftSave = true,
}) => {
  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    revenueModel: initialData?.revenueModel || 'one_time',
    priceAmount: initialData?.priceAmount || '',
    billingPeriod: initialData?.billingPeriod || 'monthly',
    usageUnitName: initialData?.usageUnitName || '',
    priceName: initialPriceName || '',
    linkName: initialLinkName || '',
  });

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pricing Assistant State
  const [pricingAssistantState, setPricingAssistantState] = useState<PricingAssistantState>('empty');
  const [pricingFormData, setPricingFormData] = useState<PricingAssistantFormData>({});
  const [pricingRecommendation, setPricingRecommendation] = useState<PricingRecommendation>();
  const [pricingError, setPricingError] = useState<{ message: string; details?: string }>();

  // Auto-save draft (only for create and create-link modes)
  const draftSave = useDraftAutoSave(
    enableDraftSave ? formData : ({} as ProductFormData),
    async (data) => {
      // Mock API call to save draft
      console.log('Saving draft:', data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    },
    5000 // 5 second throttle
  );

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate product name (only for create and edit modes)
    if (mode !== 'create-link') {
      const nameValidation = validateProductName(formData.name);
      if (!nameValidation.isValid) {
        newErrors.name = nameValidation.error!;
      }
    }

    // Validate price name (only for create-link mode)
    if (mode === 'create-link') {
      const priceNameValidation = validateProductName(formData.priceName);
      if (!priceNameValidation.isValid) {
        newErrors.priceName = priceNameValidation.error!;
      }

      // Validate link name
      const linkNameValidation = validateProductName(formData.linkName);
      if (!linkNameValidation.isValid) {
        newErrors.linkName = linkNameValidation.error!;
      }
    }

    // Validate price amount (not for edit mode)
    if (mode !== 'edit' && formData.priceAmount) {
      const priceValidation = validatePriceAmount(parseFloat(formData.priceAmount));
      if (!priceValidation.isValid) {
        newErrors.priceAmount = priceValidation.error!;
      }
    }

    // Validate unit name for usage-based (not for edit mode)
    if (mode !== 'edit' && formData.revenueModel === 'usage_based' && formData.usageUnitName) {
      const unitValidation = validateUnitName(formData.usageUnitName);
      if (!unitValidation.isValid) {
        newErrors.usageUnitName = unitValidation.error!;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle revenue model change (for create and create-link modes)
  const handleRevenueModelChange = (model: RevenueModel) => {
    if (mode === 'create' || mode === 'create-link') {
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
    }
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
      // Import generatePricingRecommendation dynamically to avoid circular dependency
      const { generatePricingRecommendation } = await import('../utils');
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

  // Handle form submit
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  // Check if primary button should be disabled
  const isPrimaryDisabled = () => {
    if (mode === 'create') {
      return !formData.name || !formData.priceAmount;
    } else if (mode === 'edit') {
      return !formData.name;
    } else if (mode === 'create-link') {
      return !formData.priceName || !formData.linkName || !formData.priceAmount;
    }
    return false;
  };

  // Render product name field
  const renderProductNameField = () => {
    if (mode === 'create-link') {
      // Read-only display
      return (
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            Product
          </label>
          <div className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700">
            {productName || 'Unknown Product'}
          </div>
        </div>
      );
    }

    // Editable field
    return (
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Product name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Weekly Business Report"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
            errors.name ? 'border-red-300 bg-red-50' : 'border-neutral-300 bg-white'
          }`}
          autoFocus
        />
        {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
      </div>
    );
  };

  // Render description field
  const renderDescriptionField = () => {
    if (mode === 'create-link') {
      // Read-only display
      return (
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            Description
          </label>
          <div className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 min-h-[100px]">
            {initialData?.description || 'No description provided'}
          </div>
        </div>
      );
    }

    // Editable field
    return (
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          What does your product deliver? <span className="text-neutral-400 font-normal">(Optional)</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g. A weekly report summarizing your key business metrics and insights"
          rows={4}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none bg-white"
        />
        <p className="mt-1.5 text-sm text-neutral-500">Help your customers understand what they'll receive.</p>
      </div>
    );
  };

  // Render revenue model selector
  const renderRevenueModelSelector = () => {
    const disabled = mode === 'edit';
    const lockReason = mode === 'edit'
      ? 'Revenue model is locked to maintain consistency with existing payment links'
      : '';

    return (
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-3">
          Revenue model <span className="text-red-500">*</span>
          {disabled && (
            <span className="ml-2 text-xs font-normal text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
              Locked
            </span>
          )}
        </label>
        {lockReason && (
          <p className="text-sm text-neutral-500 mb-3">{lockReason}</p>
        )}
        {mode === 'create-link' && (
          <p className="text-sm text-neutral-500 mb-3">
            Choose a different revenue model for this payment link.
          </p>
        )}
        <RevenueModelSelector
          selectedModel={formData.revenueModel}
          onSelect={handleRevenueModelChange}
          disabled={disabled}
        />
      </div>
  );
  };

  // Render price configuration section
  const renderPriceConfiguration = () => (
    <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm space-y-6">
      <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
        Set your price
      </h3>

      {/* Price Amount */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {formData.revenueModel === 'usage_based' ? 'Unit price' : 'Price amount'}{' '}
          <span className="text-red-500">*</span>
          {mode === 'edit' && (
            <span className="ml-2 text-xs font-normal text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
              Locked
            </span>
          )}
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
            disabled={mode === 'edit'}
            className={`w-full pl-10 pr-4 py-4 text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono font-bold transition-all ${
              errors.priceAmount ? 'border-red-300 bg-red-50' : 'border-neutral-300 bg-white'
            } ${mode === 'edit' ? 'opacity-60 cursor-not-allowed bg-neutral-50' : ''}`}
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
                  disabled={mode === 'edit'}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all capitalize ${
                    formData.billingPeriod === period
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  } ${mode === 'edit' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              disabled={mode === 'edit'}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all ${
                errors.usageUnitName ? 'border-red-300 bg-red-50' : 'border-neutral-300 bg-white'
              } ${mode === 'edit' ? 'opacity-60 cursor-not-allowed bg-neutral-50' : ''}`}
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
  );

  // Render price name field (only for create-link mode)
  const renderPriceNameField = () => {
    if (mode !== 'create-link') return null;

    return (
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Price name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.priceName}
          onChange={(e) => setFormData({ ...formData, priceName: e.target.value })}
          placeholder="e.g. Basic Tier, Pro Tier, Enterprise Plan"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
            errors.priceName ? 'border-red-300 bg-red-50' : 'border-neutral-300 bg-white'
          }`}
        />
        {errors.priceName && <p className="mt-1.5 text-sm text-red-600">{errors.priceName}</p>}
        <p className="mt-1.5 text-sm text-neutral-500">
          A name to identify this price (e.g., "Basic Tier").
        </p>
      </div>
    );
  };

  // Render link name field (only for create-link mode)
  const renderLinkNameField = () => {
    if (mode !== 'create-link') return null;

    return (
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Link name <span className="text-red-500">*</span>
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
    );
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Column: Main Form (65%) */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            {mode === 'create-link' ? 'Price Configuration' : 'Product & Pricing'}
          </h2>
          <p className="text-neutral-500">
            {mode === 'create-link' && productName
              ? `Creating payment link for "${productName}"`
              : 'Define your product and set your price.'}
          </p>
        </div>

        <div className="space-y-8">
          {/* Product Name / Product Display */}
          {renderProductNameField()}

          {/* Description */}
          {renderDescriptionField()}

          {/* Price Name (only for create-link mode) */}
          {renderPriceNameField()}

          {/* Link Name (only for create-link mode) */}
          {renderLinkNameField()}

          {/* Revenue Model Selector */}
          {renderRevenueModelSelector()}

          {/* Price Configuration */}
          {renderPriceConfiguration()}

          {/* Draft Save Indicator (only for create and create-link modes) */}
          {enableDraftSave && (mode === 'create' || mode === 'create-link') && (
            <div className="pt-4">
              <DraftSaveIndicator
                status={draftSave.status}
                lastSaved={draftSave.lastSaved}
                errorMessage={draftSave.errorMessage}
                onRetry={draftSave.retry}
              />
            </div>
          )}
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
};

export default ProductForm;
