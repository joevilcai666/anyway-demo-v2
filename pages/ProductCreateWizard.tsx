import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  Info, 
  DollarSign, 
  Calendar, 
  Zap, 
  AlertCircle,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  History
} from 'lucide-react';
import { Product, RevenueModel } from '../types';

interface WizardProps {
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'basics' | 'model_pricing' | 'payment_link';

const StepIndicator: React.FC<{ currentStep: Step }> = ({ currentStep }) => {
  const steps: { id: Step; label: string }[] = [
    { id: 'basics', label: 'Basics' },
    { id: 'model_pricing', label: 'Model, Inputs & Price' },
    { id: 'payment_link', label: 'Payment Link' },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

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
  const [currentStep, setCurrentStep] = useState<Step>('basics');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    internalNote: '',
    revenueModel: 'one_time' as RevenueModel,
    currency: 'USD',
    // Model Context
    billingPeriod: 'monthly',
    usageUnitName: '',
    // Pricing Inputs
    customerType: 'individual_or_small_team',
    useCaseCategory: '',
    costEstimate: '',
    // Value Context
    valueType: 'time' as 'time' | 'money' | 'other',
    humanEquivalent: '',
    // Price
    priceAmount: '',
  });

  // Pricing Agent State
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [isInputsChanged, setIsInputsChanged] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);

  // Payment Link State
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Track input changes to invalidate suggestion
  useEffect(() => {
    if (suggestion) {
      setIsInputsChanged(true);
    }
  }, [
    formData.revenueModel, 
    formData.currency, 
    formData.billingPeriod, 
    formData.usageUnitName, 
    formData.customerType, 
    formData.useCaseCategory, 
    formData.costEstimate,
    formData.valueType,
    formData.humanEquivalent
  ]);

  const handleNext = () => {
    if (currentStep === 'basics') setCurrentStep('model_pricing');
    else if (currentStep === 'model_pricing') setCurrentStep('payment_link');
    else onComplete();
  };

  const handleBack = () => {
    if (currentStep === 'basics') onBack();
    else if (currentStep === 'model_pricing') setCurrentStep('basics');
    else if (currentStep === 'payment_link') setCurrentStep('model_pricing');
  };

  const generateSuggestion = () => {
    setIsGenerating(true);
    // Mock API Call
    setTimeout(() => {
      setSuggestion({
        min: 19.00,
        typical: 29.00,
        max: 49.00,
        confidence: 'high',
        lastUpdated: new Date(),
        assumptions: [
          'Based on individual/small team target.',
          'Assuming 50% gross margin target.',
          'Competitive analysis of similar code tools.'
        ]
      });
      setIsGenerating(false);
      setIsInputsChanged(false);
    }, 1500);
  };

  const applySuggestion = () => {
    if (suggestion) {
      setFormData(prev => ({ ...prev, priceAmount: suggestion.typical.toString() }));
    }
  };

  const generatePaymentLink = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setGeneratedLink(`https://buy.anyway.ai/p/${Math.random().toString(36).substr(2, 9)}`);
      setIsPublishing(false);
    }, 1000);
  };

  // Helper to calculate deviation
  const getDeviationWarning = () => {
    if (!suggestion || !formData.priceAmount) return null;
    const price = parseFloat(formData.priceAmount);
    const typical = suggestion.typical;
    const diff = Math.abs(price - typical);
    const percent = (diff / typical) * 100;
    
    if (percent > 20) {
      return `You are deviating ${percent.toFixed(0)}% from the recommended price.`;
    }
    return null;
  };

  // --- Render Steps ---

  const renderBasics = () => (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left: Form */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Basics</h2>
          <p className="text-neutral-500">Define your product identity.</p>
        </div>

        <div className="space-y-6 bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Code Review Agent"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Deliverable Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Describe exactly what the customer receives..."
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Internal Note <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <input 
              type="text" 
              value={formData.internalNote}
              onChange={e => setFormData({...formData, internalNote: e.target.value})}
              placeholder="Internal tracking ID, project code, etc."
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
            />
          </div>
        </div>
      </div>

      {/* Right: Guide */}
      <div className="lg:col-span-1">
        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 sticky top-6">
          <div className="flex items-center gap-2 mb-4 text-neutral-900 font-semibold">
            <Info size={18} />
            <span>Tips for Description</span>
          </div>
          <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
            A clear description helps the Pricing Agent understand the value proposition.
          </p>
          <div className="space-y-4">
            <div className="bg-white p-3 rounded border border-neutral-200 text-sm">
              <span className="font-semibold block mb-1 text-green-700">Good Example:</span>
              "An automated Python script that scans GitHub PRs for security vulnerabilities and posts comments with fix suggestions."
            </div>
            <div className="bg-white p-3 rounded border border-neutral-200 text-sm">
              <span className="font-semibold block mb-1 text-amber-700">Needs Detail:</span>
              "A security bot."
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModelAndInputs = () => (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left: Form (Span 2) */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Model, Inputs & Price</h2>
          <p className="text-neutral-500">Configure your revenue model, provide context, and set your price.</p>
        </div>

        <div className="space-y-8">
          {/* Revenue Model Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">1. Revenue Model</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'one_time', label: 'One-time', icon: DollarSign },
                { id: 'subscription', label: 'Subscription', icon: Calendar },
                { id: 'usage_based', label: 'Usage-based', icon: Zap },
              ].map((model) => (
                <button
                  key={model.id}
                  onClick={() => setFormData({...formData, revenueModel: model.id as RevenueModel})}
                  className={`
                    relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col gap-3
                    ${formData.revenueModel === model.id
                      ? 'border-neutral-900 bg-white ring-1 ring-neutral-900/5' 
                      : 'border-neutral-200 bg-white hover:border-neutral-300'}
                  `}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.revenueModel === model.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-900'}`}>
                    <model.icon size={16} />
                  </div>
                  <span className="font-bold text-sm text-neutral-900">{model.label}</span>
                  {formData.revenueModel === model.id && (
                    <div className="absolute top-3 right-3 text-neutral-900">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Context Fields based on Model */}
            <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-lg border border-neutral-100">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Currency</label>
                <select 
                  value={formData.currency}
                  onChange={e => setFormData({...formData, currency: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="CNY">CNY (¥)</option>
                </select>
              </div>

              {formData.revenueModel === 'subscription' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Billing Period</label>
                  <select 
                    value={formData.billingPeriod}
                    onChange={e => setFormData({...formData, billingPeriod: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              {formData.revenueModel === 'usage_based' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Usage Unit Name</label>
                  <input 
                    type="text" 
                    value={formData.usageUnitName}
                    onChange={e => setFormData({...formData, usageUnitName: e.target.value})}
                    placeholder="e.g. 1k tokens"
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Pricing Inputs Section */}
          <section className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">2. Pricing Inputs</h3>
            
            <div className="space-y-4">
              {/* Target Customer */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Target Customer</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'individual_or_small_team', label: 'Individual / Small Team' },
                    { id: 'small_business', label: 'Small Business' },
                    { id: 'growth_enterprise', label: 'Growth / Enterprise' },
                  ].map((opt) => (
                    <label key={opt.id} className={`
                      flex items-center justify-center p-3 border rounded-lg cursor-pointer text-sm text-center transition-colors
                      ${formData.customerType === opt.id 
                        ? 'border-neutral-900 bg-neutral-50 text-neutral-900 font-medium' 
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}
                    `}>
                      <input 
                        type="radio" 
                        name="customerType"
                        checked={formData.customerType === opt.id}
                        onChange={() => setFormData({...formData, customerType: opt.id})}
                        className="hidden"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Use Case */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Use Case Category</label>
                <input 
                  type="text" 
                  placeholder="e.g. Code Analysis"
                  value={formData.useCaseCategory}
                  onChange={e => setFormData({...formData, useCaseCategory: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>

              {/* Value Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Value Type</label>
                  <select 
                    value={formData.valueType}
                    onChange={e => setFormData({...formData, valueType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="time">Time Saved</option>
                    <option value="money">Cost Saved</option>
                    <option value="other">Efficiency / Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {formData.valueType === 'time' ? 'Human Time Equivalent' : 
                     formData.valueType === 'money' ? 'Human Cost Equivalent' : 'Estimated Value'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={formData.valueType === 'time' ? 'e.g. 2 hours' : 'e.g. $100'}
                    value={formData.humanEquivalent}
                    onChange={e => setFormData({...formData, humanEquivalent: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Cost Inputs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-neutral-700">
                    Cost per Unit ({formData.currency})
                  </label>
                  <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <History size={12} />
                    Import from Trace
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.costEstimate}
                    onChange={e => setFormData({...formData, costEstimate: e.target.value})}
                    className="w-full pl-7 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent font-mono"
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Avg. cost of underlying model calls (OpenAI, etc.) for one unit of value.
                </p>
              </div>
            </div>
          </section>

          {/* Price Section (Moved from Step 3) */}
          <section className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">3. Set Price</h3>
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  {formData.revenueModel === 'usage_based' ? 'Unit Price' : 'Price Amount'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-lg">$</span>
                  <input 
                    type="number" 
                    value={formData.priceAmount}
                    onChange={e => setFormData({...formData, priceAmount: e.target.value})}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-4 text-2xl border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
                    {formData.currency}
                  </span>
                </div>
                {formData.revenueModel === 'subscription' && (
                   <p className="mt-2 text-sm text-neutral-500">Billed {formData.billingPeriod}</p>
                )}
              </div>

              {getDeviationWarning() && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{getDeviationWarning()}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Right: Pricing Agent (Span 1) */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden sticky top-6">
          {/* Header */}
          <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <h3 className="font-bold text-neutral-900 text-sm">Pricing Suggestion</h3>
            </div>
            {suggestion && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isInputsChanged ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
              }`}>
                {isInputsChanged ? 'Out of Date' : 'Ready'}
              </span>
            )}
          </div>

          <div className="p-6">
            {!suggestion ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                  <Sparkles size={24} />
                </div>
                <p className="text-sm text-neutral-600 mb-6">
                  Fill in the inputs to get a data-driven pricing recommendation.
                </p>
                <button
                  onClick={generateSuggestion}
                  disabled={isGenerating}
                  className="w-full py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : 'Get Pricing Suggestion'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {isInputsChanged && (
                  <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                    <span>Inputs changed.</span>
                    <button onClick={generateSuggestion} className="underline font-medium hover:text-amber-900">
                      Regenerate
                    </button>
                  </div>
                )}

                {/* Main Recommendation */}
                <div className="text-center">
                  <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Typical Price</div>
                  <div className="text-4xl font-bold text-neutral-900 font-mono mb-2">
                    ${suggestion.typical}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <span>Min: ${suggestion.min}</span>
                    <span className="text-neutral-300">|</span>
                    <span>Max: ${suggestion.max}</span>
                  </div>
                </div>

                <div className="flex justify-center">
                   <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                     suggestion.confidence === 'high' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                   }`}>
                     {suggestion.confidence === 'high' ? 'High Confidence' : 'Medium Confidence'}
                   </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={applySuggestion}
                  className="w-full py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Use This Price
                </button>

                {/* Rationale */}
                <div className="pt-4 border-t border-neutral-100">
                  <button 
                    onClick={() => setShowAssumptions(!showAssumptions)}
                    className="flex items-center justify-between w-full text-xs font-medium text-neutral-500 hover:text-neutral-900"
                  >
                    <span>Rationale & Assumptions</span>
                    {showAssumptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  
                  {showAssumptions && (
                    <ul className="mt-3 space-y-2">
                      {suggestion.assumptions.map((a: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-600">
                          <span className="mt-1 w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentLink = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Ready to sell!</h2>
        <p className="text-neutral-500">Generate your payment link to start accepting payments.</p>
      </div>

      <div className="bg-white p-8 border border-neutral-200 rounded-xl shadow-sm space-y-6">
        {!generatedLink ? (
          <div className="space-y-4">
            <p className="text-neutral-600">
              Your product <strong className="text-neutral-900">{formData.name}</strong> is currently a <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800">DRAFT</span>.
            </p>
            <button
              onClick={generatePaymentLink}
              disabled={isPublishing}
              className="w-full py-3 bg-neutral-900 text-white rounded-lg font-bold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Publishing & Generating...
                </>
              ) : (
                <>
                  Publish & Generate Link
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2 text-left">Payment Link</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 font-mono text-sm text-neutral-600 truncate text-left">
                  {generatedLink}
                </div>
                <button 
                  className="p-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors"
                  title="Copy"
                >
                  <Copy size={20} />
                </button>
                <button 
                  className="p-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors"
                  title="Open"
                >
                  <ExternalLink size={20} />
                </button>
              </div>
            </div>
            
            <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm flex items-center gap-2 justify-center">
              <Check size={16} />
              Product Published Successfully
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
            <h1 className="text-lg font-bold text-neutral-900">Add a Product</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            {/* Conditional "Next" button rendering based on step */}
            {currentStep !== 'payment_link' && (
              <button 
                onClick={handleNext}
                disabled={currentStep === 'basics' && !formData.name}
                className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next Step
                <ChevronRight size={16} />
              </button>
            )}
            {currentStep === 'payment_link' && generatedLink && (
              <button 
                onClick={onComplete}
                className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800"
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
        
        <div className="pb-20">
          {currentStep === 'basics' && renderBasics()}
          {currentStep === 'model_pricing' && renderModelAndInputs()}
          {currentStep === 'payment_link' && renderPaymentLink()}
        </div>
      </main>
    </div>
  );
};

export default ProductCreateWizard;