import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import ProductForm, { ProductFormMode, ProductFormData, getPageTitle } from '../components/ProductForm';
import { ProductSummaryCard } from '../components/ProductSummaryCard';
import { copyToClipboard } from '../utils';

interface WizardProps {
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'basic_info_pricing' | 'generate_link';

const StepIndicator: React.FC<{ currentStep: Step }> = ({ currentStep }) => {
  const steps: { id: Step; label: string }[] = [
    { id: 'basic_info_pricing', label: 'Product & Pricing' },
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

const ProductCreateWizard: React.FC<WizardProps> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>('basic_info_pricing');

  // Form State (managed by ProductForm)
  const [formData, setFormData] = useState<ProductFormData | null>(null);

  // Payment Link State
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleNext = (data: ProductFormData) => {
    setFormData(data);
    setCurrentStep('generate_link');
  };

  const handleBack = () => {
    if (currentStep === 'basic_info_pricing') {
      onBack();
    } else {
      setCurrentStep('basic_info_pricing');
    }
  };

  const generatePaymentLink = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setGeneratedLink(`https://pay.anyway.ai/p/${Math.random().toString(36).substr(2, 9)}`);
      setIsPublishing(false);
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
    <ProductForm
      mode="create"
      onSubmit={handleNext}
      onBack={handleBack}
      enableDraftSave={true}
    />
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} strokeWidth={2} />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Almost there!</h2>
        <p className="text-neutral-500">Review your product and generate your payment link.</p>
      </div>

      {/* Summary Card */}
      {formData && (
        <ProductSummaryCard
          name={formData.name || 'Untitled Product'}
          revenueModel={formData.revenueModel}
          priceAmount={parseFloat(formData.priceAmount) || 0}
          billingPeriod={formData.billingPeriod}
          usageUnitName={formData.usageUnitName}
          status="draft"
          onEdit={() => setCurrentStep('basic_info_pricing')}
        />
      )}

      {/* Generate Link Section */}
      <div className="mt-6 bg-white p-6 border border-neutral-200 rounded-xl shadow-sm space-y-6">
        {!generatedLink ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Your product will be <strong>published automatically</strong> when you generate the payment link.
            </p>
            <button
              onClick={generatePaymentLink}
              disabled={isPublishing}
              className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2 text-base"
            >
              {isPublishing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating link…
                </>
              ) : (
                <>
                  <Sparkles size={20} />
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
                <p className="font-semibold">Your product is live!</p>
                <p className="text-emerald-700 mt-0.5">Start sharing your payment link to receive payments.</p>
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

            {/* What's Next (collapsible) */}
            <div className="pt-4 border-t border-neutral-100">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors list-none">
                  <span>What's next?</span>
                  <ChevronRight size={16} className="transition-transform group-open:rotate-90" />
                </summary>
                <div className="mt-3 space-y-2 text-sm text-neutral-600 text-left pl-4">
                  <p>• Share your link on social media or with customers</p>
                  <p>• Create additional payment links for campaigns</p>
                  <p>• Track your orders and revenue in the Orders section</p>
                </div>
              </details>
            </div>
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
            <h1 className="text-lg font-bold text-neutral-900">{getPageTitle('create')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto py-8 px-6">
        <StepIndicator currentStep={currentStep} />

        <div className="pb-20">{currentStep === 'basic_info_pricing' ? renderStep1() : renderStep2()}</div>
      </main>
    </div>
  );
};

export default ProductCreateWizard;
