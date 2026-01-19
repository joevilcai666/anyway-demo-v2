import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  MoreHorizontal,
  Box,
  Edit,
  Archive,
  ChevronRight,
} from 'lucide-react';
import { Product, ProductStatus } from '../types';
import ProductCreateWizard from './ProductCreateWizard';
import ProductEditWizard from './ProductEditWizard';
import ProductDetailPage from './ProductDetailPage';
import PaymentLinkWizard from './PaymentLinkWizard';
import { mockProducts } from '../constants';
import { formatDate } from '../utils';

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

// --- Main Page Component ---

const ProductsPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'detail' | 'payment_link_wizard' | 'edit'>('list');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProductStatus | 'all'>('all');
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

  const filteredProducts = products.filter((p) => filterStatus === 'all' || p.status === filterStatus);

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
          // Update the product in the list
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
                  <th className="px-6 py-3 font-medium">Descriptions</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product) => {
                  const isMenuActive = activeMenuProductId === product.id;

                  return (
                    <tr
                      key={product.id}
                      className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      {/* Product Name */}
                      <td className="px-6 py-4">
                        <div
                          className="font-semibold text-neutral-900 text-sm"
                          onClick={() => {
                            setSelectedProductId(product.id);
                            setView('detail');
                          }}
                        >
                          {product.name}
                        </div>
                      </td>

                      {/* Descriptions */}
                      <td className="px-6 py-4">
                        <div
                          className="text-xs text-neutral-600 truncate max-w-[300px] leading-relaxed"
                          onClick={() => {
                            setSelectedProductId(product.id);
                            setView('detail');
                          }}
                        >
                          {product.deliverable_description || <span className="text-neutral-400 italic">No description</span>}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={product.status} />
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600">{formatDate(product.createdAt)}</span>
                      </td>

                      {/* Three-dot Menu */}
                      <td className="px-4 py-4 text-right">
                        <div className="relative inline-block" ref={isMenuActive ? menuRef : null}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuProductId(isMenuActive ? null : product.id);
                            }}
                            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-400 hover:text-neutral-600"
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
                                Edit Product
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeactivateProduct(product.id);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-3 transition-colors border-t border-neutral-100"
                              >
                                <Archive size={16} strokeWidth={2} />
                                Deactivate
                              </button>
                            </div>
                          )}
                        </div>
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
