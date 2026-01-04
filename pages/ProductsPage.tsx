import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Box, 
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Product, ProductStatus, RevenueModel } from '../types';
import ProductCreateWizard from './ProductCreateWizard';
import ProductDetailPage from './ProductDetailPage';

// --- Mock Data ---

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_01',
    merchantId: 'mer_01',
    name: 'Code Review Agent',
    description: 'Automated code review for PRs',
    status: 'published',
    revenueModel: 'usage_based',
    defaultPrice: {
      id: 'price_01',
      productId: 'prod_01',
      revenueModel: 'usage_based',
      currency: 'USD',
      isDefault: true,
      unitAmount: 0.05,
      usageUnitName: 'per review',
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
    last7dPayments: 1250.50
  },
  {
    id: 'prod_02',
    merchantId: 'mer_01',
    name: 'SEO Blog Generator',
    description: 'Generate high-quality blog posts',
    status: 'published',
    revenueModel: 'subscription',
    defaultPrice: {
      id: 'price_02',
      productId: 'prod_02',
      revenueModel: 'subscription',
      currency: 'USD',
      isDefault: true,
      amount: 49.00,
      billingPeriod: 'monthly'
    },
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z',
    last7dPayments: 2450.00
  },
  {
    id: 'prod_03',
    merchantId: 'mer_01',
    name: 'Legal Doc Analyzer',
    status: 'draft',
    revenueModel: 'one_time',
    defaultPrice: {
      id: 'price_03',
      productId: 'prod_03',
      revenueModel: 'one_time',
      currency: 'USD',
      isDefault: true,
      amount: 299.00,
    },
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
    last7dPayments: 0
  }
];

// --- Components ---

const StatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
  const styles = {
    published: 'bg-green-50 text-green-700 border-green-100',
    draft: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    archived: 'bg-neutral-50 text-neutral-400 border-neutral-100',
  };

  return (
    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${styles[status] || styles.draft} uppercase tracking-wide`}>
      {status}
    </span>
  );
};

const ModelBadge: React.FC<{ model: RevenueModel }> = ({ model }) => {
  const labels = {
    one_time: 'One-time',
    subscription: 'Subscription',
    usage_based: 'Usage-based',
  };
  
  return (
    <span className="text-xs text-neutral-600 font-medium bg-neutral-100 px-2 py-0.5 rounded-md">
      {labels[model]}
    </span>
  );
};

const PriceDisplay: React.FC<{ price?: any }> = ({ price }) => {
  if (!price) return <span className="text-neutral-400">-</span>;

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: price.currency }).format(amount);

  if (price.revenueModel === 'one_time') {
    return <span className="font-mono text-sm text-neutral-900">{formatCurrency(price.amount)}</span>;
  }
  if (price.revenueModel === 'subscription') {
    return (
      <span className="font-mono text-sm text-neutral-900">
        {formatCurrency(price.amount)} <span className="text-neutral-500 text-xs">/ {price.billingPeriod}</span>
      </span>
    );
  }
  if (price.revenueModel === 'usage_based') {
    return (
      <span className="font-mono text-sm text-neutral-900">
        {formatCurrency(price.unitAmount)} <span className="text-neutral-500 text-xs">/ {price.usageUnitName}</span>
      </span>
    );
  }
  return null;
};

// --- Main Page Component ---

const ProductsPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProductStatus | 'all'>('all');

  const filteredProducts = products.filter(p => filterStatus === 'all' || p.status === filterStatus);

  if (view === 'create') {
    return (
      <ProductCreateWizard 
        onBack={() => setView('list')}
        onComplete={() => {
          setView('list');
        }}
      />
    );
  }

  if (view === 'detail') {
    const productToShow = products.find(p => p.id === selectedProductId) || products[0];
    
    return (
      <ProductDetailPage 
        product={productToShow}
        onBack={() => {
          setSelectedProductId(null);
          setView('list');
        }}
      />
    );
  }

  // --- List View ---
  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-neutral-200 bg-white flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your AI agents, pricing, and payment links.</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add a Product
        </button>
      </div>

      {/* Filters & Content */}
      <div className="p-8 flex-1 overflow-auto">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-neutral-200">
          {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-4 py-2 text-sm font-medium border-b-2 transition-colors
                ${filterStatus === status 
                  ? 'border-neutral-900 text-neutral-900' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'}
              `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Table */}
        {filteredProducts.length > 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Revenue Model</th>
                  <th className="px-6 py-3 font-medium text-right">Default Price</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Last 7d Payments</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setView('detail');
                    }}
                    className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900 text-sm">{product.name}</div>
                      {product.description && (
                        <div className="text-xs text-neutral-500 mt-0.5 truncate max-w-[240px]">
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <ModelBadge model={product.revenueModel} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <PriceDisplay price={product.defaultPrice} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-sm text-neutral-900">
                        ${product.last7dPayments?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-neutral-400">
                      <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-200 border-dashed rounded-lg">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-300">
              <Box size={32} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {filterStatus === 'all' ? 'Create your first product' : 'No products found'}
            </h3>
            <p className="text-neutral-500 text-sm max-w-sm text-center mb-6">
              {filterStatus === 'all' 
                ? "Start building your catalog. Define your AI agents or services to generate pricing and payment links."
                : `There are no products with status "${filterStatus}".`
              }
            </p>
            {filterStatus === 'all' && (
              <button 
                onClick={() => setView('create')}
                className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Create your first product
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
