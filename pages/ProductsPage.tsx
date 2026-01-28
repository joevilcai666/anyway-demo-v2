import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  MoreHorizontal,
  Box,
  Edit,
  Archive,
  Search,
  Filter,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react';
import { Product, ProductStatus } from '../types';
import ProductCreateWizard from './ProductCreateWizard';
import ProductEditWizard from './ProductEditWizard';
import ProductDetailPage from './ProductDetailPage';
import PaymentLinkWizard from './PaymentLinkWizard';
import { mockProducts, getProductAnalytics, ProductAnalytics } from '../constants';
import { formatDate } from '../utils';

// --- Components ---

const StatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
  const styles = {
    published: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      label: 'Live',
    },
    draft: {
      bg: 'bg-neutral-100',
      text: 'text-neutral-600',
      border: 'border-neutral-300',
      label: 'Paused',
    },
    archived: {
      bg: 'bg-neutral-50',
      text: 'text-neutral-400',
      border: 'border-neutral-200',
      label: 'Archived',
    },
  };

  const style = styles[status] || styles.draft;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${style.bg} ${style.text} ${style.border} uppercase tracking-wide`}>
      {style.label}
    </span>
  );
};

const RevenueBadge: React.FC<{ revenueModel: string }> = ({ revenueModel }) => {
  const modelLabels: Record<string, string> = {
    subscription: 'Subscription',
    one_time: 'One-time',
    usage_based: 'Usage-based',
  };

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
      {modelLabels[revenueModel] || revenueModel}
    </span>
  );
};

// --- Main Page Component ---

const ProductsPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'detail' | 'payment_link_wizard' | 'edit'>('list');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProductStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuProductId, setActiveMenuProductId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuProductId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter products by status and search query
  const filteredProducts = products.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.deliverable_description &&
        p.deliverable_description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Handle menu actions
  const handleEditProduct = (productId: string) => {
    setActiveMenuProductId(null);
    setSelectedProductId(productId);
    setView('edit');
  };

  const handleDeactivateProduct = (productId: string) => {
    setActiveMenuProductId(null);
    setProducts(products.map(p =>
      p.id === productId ? { ...p, status: 'archived' as ProductStatus } : p
    ));
  };

  const handleDuplicateProduct = (productId: string) => {
    setActiveMenuProductId(null);
    const product = products.find(p => p.id === productId);
    if (product) {
      const newProduct: Product = {
        ...product,
        id: `prod_${Date.now()}`,
        name: `${product.name} (Copy)`,
        status: 'draft' as ProductStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
    }
  };

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

  if (view === 'edit' && selectedProductId) {
    return (
      <ProductEditWizard
        productId={selectedProductId}
        onBack={() => {
          setSelectedProductId(null);
          setView('list');
        }}
        onSave={(updatedData) => {
          console.log('Product updated:', updatedData);
          setProducts(products.map(p =>
            p.id === selectedProductId
              ? { ...p, name: updatedData.name, deliverable_description: updatedData.description }
              : p
          ));
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
        onEditProduct={() => {
          setView('edit');
        }}
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
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
        >
          <Plus size={16} />
          Create Product
        </button>
      </div>

      {/* Filters & Content */}
      <div className="p-8 flex-1 overflow-auto">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-neutral-200">
          {(['all', 'published', 'draft', 'archived'] as const).map((status) => {
            const labels: Record<string, string> = {
              all: 'All',
              published: 'Live',
              draft: 'Paused',
              archived: 'Archived',
            };
            return (
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
                {labels[status] || status}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const analytics = getProductAnalytics(product.id);
              const isMenuActive = activeMenuProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {/* Product Name & Status */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2 truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={product.status} />
                          <RevenueBadge revenueModel={product.revenueModel} />
                        </div>
                      </div>

                      {/* Three-dot Menu */}
                      <div className="relative" ref={isMenuActive ? menuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuProductId(isMenuActive ? null : product.id);
                          }}
                          className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-400 hover:text-neutral-600"
                        >
                          <MoreHorizontal size={18} strokeWidth={2} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuActive && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 animate-in fade-in slide-in-from-top-1 duration-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditProduct(product.id);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                            >
                              <Edit size={16} strokeWidth={2} />
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateProduct(product.id);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-3 transition-colors border-t border-neutral-100"
                            >
                              <Box size={16} strokeWidth={2} />
                              Duplicate
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeactivateProduct(product.id);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-neutral-100"
                            >
                              <Archive size={16} strokeWidth={2} />
                              Deactivate
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 mb-5 line-clamp-2 min-h-[40px] leading-relaxed">
                      {product.deliverable_description || <span className="text-neutral-400 italic">No description</span>}
                    </p>

                    {/* Metrics */}
                    {analytics && analytics.totalRevenue > 0 ? (
                      <div className="space-y-3">
                        {/* Revenue */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <DollarSign size={14} strokeWidth={2} />
                            <span>Total Revenue</span>
                          </div>
                          <span className="text-sm font-semibold text-neutral-900">
                            ${analytics.totalRevenue.toLocaleString()}
                          </span>
                        </div>

                        {/* Subscribers (if subscription) */}
                        {product.revenueModel === 'subscription' && analytics.subscribers > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                              <Users size={14} strokeWidth={2} />
                              <span>Subscribers</span>
                            </div>
                            <span className="text-sm font-semibold text-neutral-900">
                              {analytics.subscribers.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* Growth Indicator */}
                        {analytics.revenueGrowth !== 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                              <span>Growth</span>
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-medium ${
                              analytics.revenueGrowth > 0 ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {analytics.revenueGrowth > 0 ? (
                                <TrendingUp size={14} strokeWidth={2} />
                              ) : (
                                <TrendingDown size={14} strokeWidth={2} />
                              )}
                              <span>{Math.abs(analytics.revenueGrowth)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-neutral-400">
                        No data yet
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 rounded-b-xl">
                    <button
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setView('detail');
                      }}
                      className="w-full flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-white transition-all py-2 px-4 rounded-lg border border-neutral-200 hover:border-neutral-300"
                    >
                      View Details
                      <ChevronRight size={16} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-200 border-dashed rounded-xl">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
              <Box size={32} className="text-neutral-300" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {filterStatus === 'all' && !searchQuery
                ? 'Create your first product'
                : searchQuery
                ? 'No products match your search'
                : `No ${filterStatus} products`}
            </h3>
            <p className="text-neutral-500 text-sm max-w-sm text-center mb-6">
              {filterStatus === 'all' && !searchQuery
                ? 'Start building your catalog. Define your AI agents or services to generate pricing and payment links.'
                : searchQuery
                ? 'Try adjusting your search terms'
                : `There are no products with status "${filterStatus}".`}
            </p>
            {filterStatus === 'all' && !searchQuery && (
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
