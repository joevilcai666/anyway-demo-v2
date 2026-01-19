import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { Product, PaymentLink, Price } from '../types';
import { PaymentLinksList } from '../components/PaymentLinksList';
import { formatDate, formatDateTime, formatPrice } from '../utils';
import { mockPrices, mockPaymentLinks, getPricesByProduct, getPaymentLinksByProduct } from '../constants';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onEditProduct: () => void;
  onCreatePaymentLink: () => void;
}

// Helper to get status badge config
const getStatusBadge = (status: 'draft' | 'published' | 'archived') => {
  switch (status) {
    case 'draft':
      return {
        label: 'Draft',
        bg: 'bg-neutral-100',
        text: 'text-neutral-600',
        border: 'border-neutral-300',
      };
    case 'published':
      return {
        label: 'Published',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    case 'archived':
      return {
        label: 'Archived',
        bg: 'bg-neutral-50',
        text: 'text-neutral-500',
        border: 'border-neutral-200',
      };
  }
};

// Mock product data (in real app, fetch by productId)
const mockProduct: Product = {
  id: 'prod_1',
  merchantId: 'merchant_1',
  name: 'Weekly Business Report',
  deliverable_description: 'A comprehensive weekly report summarizing your key business metrics, trends, and actionable insights.',
  status: 'published',
  revenueModel: 'subscription',
  createdAt: '2026-01-10T09:00:00Z',
  updatedAt: '2026-01-13T10:00:00Z',
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onEditProduct,
  onCreatePaymentLink,
}) => {
  // Mock data fetching (in real app, use API)
  const product = mockProduct;
  const prices = getPricesByProduct(productId);
  const paymentLinks = getPaymentLinksByProduct(productId);

  // Get current price (first price for mock)
  const currentPrice = prices[0];

  // State for modals
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLinkName, setEditingLinkName] = useState('');

  // Handlers for PaymentLinksList
  const handleCopyUrl = (url: string) => {
    console.log('Copied URL:', url);
  };

  const handleToggleStatus = (linkId: string) => {
    console.log('Toggle status for link:', linkId);
  };

  const handleEditName = (linkId: string, currentName: string) => {
    setEditingLinkId(linkId);
    setEditingLinkName(currentName);
    setShowEditNameModal(true);
  };

  const handleDelete = (linkId: string) => {
    console.log('Delete link:', linkId);
  };

  const statusBadge = getStatusBadge(product.status);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-neutral-900">{product.name}</h1>
                <span
                  className={`px-2.5 py-0.5 text-xs font-medium rounded-full uppercase tracking-wide border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                >
                  {statusBadge.label}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 font-mono">ID: {product.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto py-8 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Overview Section */}
          <section
            className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">{product.name}</h2>

                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      Description
                    </label>
                    <p className="text-sm text-neutral-700 mt-1 leading-relaxed">
                      {product.deliverable_description || <span className="text-neutral-400 italic">No description provided</span>}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                        Created
                      </label>
                      <p className="text-sm text-neutral-600 mt-1">{formatDate(product.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                        Last updated
                      </label>
                      <p className="text-sm text-neutral-600 mt-1">{formatDateTime(product.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={onEditProduct}
                className="shrink-0 px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-center gap-2"
              >
                <Edit size={16} strokeWidth={2} />
                Edit product
              </button>
            </div>
          </section>

          {/* Payment Links Section */}
          <section
            className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ExternalLink size={18} className="text-neutral-400" strokeWidth={2} />
                <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Payment Links</h2>
                <span className="text-xs text-neutral-400">({paymentLinks.length} links)</span>
              </div>
              <button
                onClick={onCreatePaymentLink}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-all shadow-sm hover:shadow flex items-center gap-2"
              >
                <Plus size={16} />
                Create payment link
              </button>
            </div>

            <PaymentLinksList
              links={paymentLinks}
              prices={prices}
              onCreateLink={onCreatePaymentLink}
              onCopyUrl={handleCopyUrl}
              onToggleStatus={handleToggleStatus}
              onEditName={handleEditName}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>

      {/* Edit Link Name Modal (simplified) */}
      {showEditNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Edit link name</h3>
            <input
              type="text"
              value={editingLinkName}
              onChange={(e) => setEditingLinkName(e.target.value)}
              placeholder="Enter link name"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 mb-4"
              autoFocus
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEditNameModal(false)}
                className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Save link name:', editingLinkName, 'for link:', editingLinkId);
                  setShowEditNameModal(false);
                }}
                className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
