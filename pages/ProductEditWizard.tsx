import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Loader2,
  Save,
} from 'lucide-react';
import ProductForm, { ProductFormData, getPageTitle } from '../components/ProductForm';
import { Product, RevenueModel } from '../types';
import { mockProducts, getPricesByProduct } from '../constants';

interface ProductEditWizardProps {
  productId: string;
  onBack: () => void;
  onSave?: (updatedData: ProductFormData) => void;
}

const ProductEditWizard: React.FC<ProductEditWizardProps> = ({
  productId,
  onBack,
  onSave,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load product data
  useEffect(() => {
    const loadProduct = () => {
      setIsLoading(true);
      // Mock API call to load product
      setTimeout(() => {
        const foundProduct = mockProducts.find((p) => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        }
        setIsLoading(false);
      }, 500);
    };

    loadProduct();
  }, [productId]);

  // Handle form submit
  const handleSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Mock API call to save changes
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Saving product changes:', {
      productId,
      updatedData: data,
    });

    setIsSaving(false);
    setSaveSuccess(true);

    // Call parent callback
    onSave?.(data);

    // Clear success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Get initial data for ProductForm
  const getInitialData = () => {
    if (!product) return undefined;

    // Get the first price for this product
    const prices = getPricesByProduct(productId);
    const firstPrice = prices[0];

    return {
      name: product.name,
      description: product.deliverable_description || '',
      revenueModel: product.revenueModel,
      priceAmount: firstPrice?.unit_amount?.toString() || '',
      billingPeriod: firstPrice?.billing_period || 'monthly',
      usageUnitName: firstPrice?.usage_unit_name || '',
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-neutral-900">{getPageTitle('edit')}</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto py-8 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 size={40} className="animate-spin text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-500">Loading product...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-neutral-900">{getPageTitle('edit')}</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto py-8 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-900 mb-2">Product not found</p>
              <p className="text-neutral-500 mb-6">The product you're looking for doesn't exist.</p>
              <button
                onClick={onBack}
                className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-all"
              >
                Go back
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            <h1 className="text-lg font-bold text-neutral-900">{getPageTitle('edit')}</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Success message */}
            {saveSuccess && (
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 animate-in fade-in slide-in-from-right-4 duration-300">
                <Check size={16} strokeWidth={2.5} />
                Saved successfully
              </div>
            )}

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
        <ProductForm
          mode="edit"
          initialData={getInitialData()}
          onSubmit={handleSubmit}
          onBack={onBack}
          enableDraftSave={false}
        />
      </main>
    </div>
  );
};

export default ProductEditWizard;
