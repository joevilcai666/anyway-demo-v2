import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Copy,
  Edit,
  Trash2,
  Power,
  Plus,
  ExternalLink,
  Check,
  Loader2,
} from 'lucide-react';
import { PaymentLink, Price, RevenueModel } from '../types';
import { formatPrice, formatDate, copyToClipboard } from '../utils';

interface PaymentLinksListProps {
  links: PaymentLink[];
  prices: Price[];
  onCreateLink: () => void;
  onCopyUrl: (url: string) => void;
  onToggleStatus: (linkId: string) => void;
  onEditName: (linkId: string, currentName: string) => void;
  onDelete: (linkId: string) => void;
  loading?: boolean;
}

// Helper to get price by price_id
const getPriceForLink = (link: PaymentLink, prices: Price[]): Price | undefined => {
  return prices.find((price) => price.price_id === link.price_id);
};

// Truncate URL for display
const truncateUrl = (url: string, maxLength: number = 35): string => {
  if (url.length <= maxLength) return url;
  return `${url.substring(0, maxLength)}...`;
};

export const PaymentLinksList: React.FC<PaymentLinksListProps> = ({
  links,
  prices,
  onCreateLink,
  onCopyUrl,
  onToggleStatus,
  onEditName,
  onDelete,
  loading = false,
}) => {
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Handle copy with feedback
  const handleCopy = async (url: string, linkId: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedLinkId(linkId);
      onCopyUrl(url);
      setTimeout(() => setCopiedLinkId(null), 2000);
    }
  };

  // Handle delete with confirmation
  const handleDelete = (linkId: string) => {
    if (deleteConfirmId === linkId) {
      onDelete(linkId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(linkId);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (links.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <LinkIcon size={40} className="text-neutral-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">No payment links yet</h3>
        <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
          Create your first payment link to start receiving payments for this product.
        </p>
        <button
          onClick={onCreateLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Create payment link
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Link Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                URL
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Created
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {links.map((link) => {
              const price = getPriceForLink(link, prices);
              const isCopied = copiedLinkId === link.payment_link_id;
              const isDeleting = deleteConfirmId === link.payment_link_id;

              return (
                <tr
                  key={link.payment_link_id}
                  className="hover:bg-neutral-50/50 transition-colors duration-150"
                >
                  {/* Link Name */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onEditName(link.payment_link_id, link.link_name)}
                      className="flex items-center gap-2 text-left group"
                    >
                      <LinkIcon size={16} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                      <span className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                        {link.link_name}
                      </span>
                      <Edit size={14} className="text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                    </button>
                  </td>

                  {/* URL */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-600 font-mono">
                        {truncateUrl(link.url)}
                      </span>
                      <button
                        onClick={() => handleCopy(link.url, link.payment_link_id)}
                        className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors group relative"
                        title={isCopied ? 'Copied!' : 'Copy URL'}
                      >
                        {isCopied ? (
                          <Check size={16} className="text-emerald-600" strokeWidth={2.5} />
                        ) : (
                          <Copy size={16} className="text-neutral-400 group-hover:text-neutral-600" strokeWidth={2} />
                        )}
                      </button>
                      <button
                        onClick={() => window.open(link.url, '_blank')}
                        className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors group"
                        title="Open link"
                      >
                        <ExternalLink size={16} className="text-neutral-400 group-hover:text-neutral-600" strokeWidth={2} />
                      </button>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    {price ? (
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{price.price_name}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{formatPrice(price as any)}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-400 italic">Price not found</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleStatus(link.payment_link_id)}
                      className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                        ${
                          link.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
                        }
                      `}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          link.status === 'active' ? 'bg-emerald-500' : 'bg-neutral-400'
                        }`}
                      />
                      {link.status === 'active' ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{formatDate(link.created_at)}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Copy URL */}
                      <button
                        onClick={() => handleCopy(link.url, link.payment_link_id)}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="Copy URL"
                      >
                        {isCopied ? (
                          <Check size={16} className="text-emerald-600" strokeWidth={2.5} />
                        ) : (
                          <Copy size={16} className="text-neutral-400" strokeWidth={2} />
                        )}
                      </button>

                      {/* Enable/Disable */}
                      <button
                        onClick={() => onToggleStatus(link.payment_link_id)}
                        className={`p-2 hover:bg-neutral-100 rounded-lg transition-colors ${
                          link.status === 'active' ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                        title={link.status === 'active' ? 'Disable link' : 'Enable link'}
                      >
                        <Power size={16} strokeWidth={2} />
                      </button>

                      {/* Edit Name */}
                      <button
                        onClick={() => onEditName(link.payment_link_id, link.link_name)}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-400 hover:text-neutral-600"
                        title="Edit name"
                      >
                        <Edit size={16} strokeWidth={2} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(link.payment_link_id)}
                        className={`p-2 rounded-lg transition-all ${
                          isDeleting
                            ? 'bg-red-100 text-red-600'
                            : 'hover:bg-red-50 text-neutral-400 hover:text-red-600'
                        }`}
                        title={isDeleting ? 'Click to confirm' : 'Delete link'}
                      >
                        {isDeleting ? (
                          <Check size={16} strokeWidth={2.5} />
                        ) : (
                          <Trash2 size={16} strokeWidth={2} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {links.map((link) => {
          const price = getPriceForLink(link, prices);
          const isCopied = copiedLinkId === link.payment_link_id;
          const isDeleting = deleteConfirmId === link.payment_link_id;

          return (
            <div
              key={link.payment_link_id}
              className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4 space-y-4"
            >
              {/* Header: Link Name + Status */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <button
                    onClick={() => onEditName(link.payment_link_id, link.link_name)}
                    className="flex items-center gap-2 group"
                  >
                    <LinkIcon size={18} className="text-neutral-400" strokeWidth={2} />
                    <span className="text-base font-bold text-neutral-900">{link.link_name}</span>
                  </button>
                </div>
                <button
                  onClick={() => onToggleStatus(link.payment_link_id)}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all shrink-0
                    ${
                      link.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                    }
                  `}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      link.status === 'active' ? 'bg-emerald-500' : 'bg-neutral-400'
                    }`}
                  />
                  {link.status === 'active' ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* URL with Copy */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1 block">
                  Payment Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 font-mono text-xs text-neutral-600 truncate">
                    {link.url}
                  </div>
                  <button
                    onClick={() => handleCopy(link.url, link.payment_link_id)}
                    className="p-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors shrink-0"
                  >
                    {isCopied ? (
                      <Check size={18} className="text-emerald-600" strokeWidth={2.5} />
                    ) : (
                      <Copy size={18} className="text-neutral-400" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              {/* Price Info */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1 block">
                  Price
                </label>
                {price ? (
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{price.price_name}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">{formatPrice(price as any)}</div>
                  </div>
                ) : (
                  <span className="text-sm text-neutral-400 italic">Price not found</span>
                )}
              </div>

              {/* Created Date */}
              <div className="text-xs text-neutral-500">
                Created {formatDate(link.created_at)}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleStatus(link.payment_link_id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      link.status === 'active'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <Power size={14} strokeWidth={2} />
                    {link.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => onEditName(link.payment_link_id, link.link_name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 border border-neutral-200 hover:bg-neutral-50 transition-colors"
                  >
                    <Edit size={14} strokeWidth={2} />
                    Edit
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(link.payment_link_id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isDeleting
                      ? 'bg-red-100 text-red-600 border-red-200'
                      : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <Check size={14} strokeWidth={2.5} />
                      Confirm?
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} strokeWidth={2} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
