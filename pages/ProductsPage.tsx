import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Box,
  ExternalLink,
  ChevronRight,
  Link as LinkIcon,
} from 'lucide-react';
import { Product, ProductStatus, RevenueModel } from '../types';
import ProductCreateWizard from './ProductCreateWizard';
import ProductDetailPage from './ProductDetailPage';
import PaymentLinkWizard from './PaymentLinkWizard';
import { mockProducts, getPaymentLinksCount } from '../constants';

// --- Components ---

const StatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
  const styles = {
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-neutral-100 text-neutral-600 border-neutral-300',
    archived: 'bg-neutral-50 text-neutral-400 border-neutral-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status] || styles.draft} uppercase tracking-wide`}>
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

  const styles = {
    one_time: 'bg-amber-50 text-amber-700 border-amber-200',
    subscription: 'bg-blue-50 text-blue-700 border-blue-200',
    usage_based: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[model]}`}>
      {labels[model]}
    </span>
  );
};

const LinksCount: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="flex items-center gap-1.5 text-neutral-600">
      <LinkIcon size={14} strokeWidth={2} />
      <span className="text-sm font-medium">{count} {count === 1 ? 'link' : 'links'}</span>
    </div>
  );
};

// --- Main Page Component ---

const ProductsPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'detail' | 'payment_link_wizard'>('list');
  const [products] = useState<Product[]>(mockProducts);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProductStatus | 'all'>('all');

  const filteredProducts = products.filter((p) => filterStatus === 'all' || p.status === filterStatus);

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

  if (view === 'detail' && selectedProductId) {
    return (
      <ProductDetailPage
        productId={selectedProductId}
        onBack={() => {
          setSelectedProductId(null);
          setView('list');
        }}
        onEditProduct={() => console.log('Edit product')}
        onCreatePaymentLink={() => setView('payment_link_wizard')}
      />
    );
  }

  if (view === 'payment_link_wizard' && selectedProductId) {
    const selectedProduct = products.find(p => p.id === selectedProductId);
    return (
      <PaymentLinkWizard
        productId={selectedProductId}
        productName={selectedProduct?.name}
        onBack={() => setView('detail')}
        onComplete={(linkId) => {
          console.log('Payment link created:', linkId);
          setView('detail');
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
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
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
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Revenue Model</th>
                  <th className="px-6 py-3 font-medium">Links</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product) => {
                  const linksCount = getPaymentLinksCount(product.id);

                  return (
                    <tr
                      key={product.id}
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setView('detail');
                      }}
                      className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      {/* Product Name */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-neutral-900 text-sm">{product.name}</div>
                        {product.deliverable_description && (
                          <div className="text-xs text-neutral-500 mt-0.5 truncate max-w-[280px] leading-relaxed">
                            {product.deliverable_description}
                          </div>
                        )}
                      </td>

                      {/* Revenue Model */}
                      <td className="px-6 py-4">
                        <ModelBadge model={product.revenueModel} />
                      </td>

                      {/* Links Count */}
                      <td className="px-6 py-4">
                        <LinksCount count={linksCount} />
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={product.status} />
                      </td>

                      {/* Chevron */}
                      <td className="px-4 py-4 text-right text-neutral-400">
                        <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-200 border-dashed rounded-xl">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
              <Box size={32} className="text-neutral-300" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {filterStatus === 'all' ? 'Create your first product' : 'No products found'}
            </h3>
            <p className="text-neutral-500 text-sm max-w-sm text-center mb-6">
              {filterStatus === 'all'
                ? 'Start building your catalog. Define your AI agents or services to generate pricing and payment links.'
                : `There are no products with status "${filterStatus}".`}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={() => setView('create')}
                className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
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
