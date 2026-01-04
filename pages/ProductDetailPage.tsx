import React from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  MoreHorizontal, 
  Copy, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product; // In real app, might just pass ID
  onBack: () => void;
}

const ProductDetailPage: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  
  // Mock Performance Data
  const performance = {
    clicks: 1250,
    checkoutStarted: 340,
    paid: 85,
    conversionRate: '6.8%'
  };

  // Mock Links
  const links = [
    { id: 'pl_01', url: 'https://buy.anyway.ai/p/code-review-basic', status: 'active', clicks: 850, sales: 50 },
    { id: 'pl_02', url: 'https://buy.anyway.ai/p/code-review-pro', status: 'active', clicks: 400, sales: 35 },
  ];

  // Dynamic Pricing Logic for Mock
  const currentPrice = product.defaultPrice?.unitAmount || product.defaultPrice?.amount || 0;
  // Mock typical price to be slightly different to show deviation
  // If current is 0.05, typical might be 0.04
  const typicalPrice = currentPrice > 0 ? currentPrice * 0.85 : 0; 
  const deviation = typicalPrice > 0 ? ((currentPrice - typicalPrice) / typicalPrice) * 100 : 0;
  const isHighConfidence = true;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] overflow-y-auto">
      {/* Header */}
      <div className="px-8 py-6 border-b border-neutral-200 bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-neutral-900">{product.name}</h1>
              <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full uppercase tracking-wide border
                ${product.status === 'published' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-neutral-100 text-neutral-600 border-neutral-200'}
              `}>
                {product.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 font-mono text-opacity-80">ID: {product.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors">
            <MoreHorizontal size={20} />
          </button>
          <button className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
            <ExternalLink size={16} />
            Create payment link
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wide) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Overview */}
          <section className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-neutral-500 mb-1">Description</div>
                <div className="text-sm text-neutral-900">{product.description || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Revenue Model</div>
                <div className="text-sm text-neutral-900 font-medium capitalize">{product.revenueModel.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Created</div>
                <div className="text-sm text-neutral-900 font-mono">
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </section>

          {/* Performance Funnel */}
          <section className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Performance (Last 30d)</h2>
              <select className="text-xs border border-neutral-200 rounded px-2 py-1 bg-neutral-50">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between relative px-4">
              {/* Connector Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-100 -z-10" />

              <div className="text-center bg-white px-4">
                <div className="text-2xl font-bold text-neutral-900 font-mono mb-1">{performance.clicks}</div>
                <div className="text-xs text-neutral-500 font-medium flex items-center justify-center gap-1">
                  <Activity size={12} /> Clicks
                </div>
              </div>

              <div className="text-center bg-white px-4">
                <div className="text-2xl font-bold text-neutral-900 font-mono mb-1">{performance.checkoutStarted}</div>
                <div className="text-xs text-neutral-500 font-medium flex items-center justify-center gap-1">
                  <Users size={12} /> Checkout
                </div>
              </div>

              <div className="text-center bg-white px-4">
                <div className="text-2xl font-bold text-neutral-900 font-mono mb-1">{performance.paid}</div>
                <div className="text-xs text-neutral-500 font-medium flex items-center justify-center gap-1">
                  <DollarSign size={12} /> Paid
                </div>
              </div>
            </div>
          </section>

          {/* Payment Links */}
          <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
             <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Active Links</h2>
             </div>
             <table className="w-full text-left">
                <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">URL</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Clicks</th>
                    <th className="px-6 py-3 text-right">Sales</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm">
                  {links.map(link => (
                    <tr key={link.id} className="group hover:bg-neutral-50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-neutral-600 truncate max-w-[200px]">{link.url}</span>
                          <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                          link.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {link.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-neutral-900">{link.clicks}</td>
                      <td className="px-6 py-3 text-right font-mono text-neutral-900">{link.sales}</td>
                      <td className="px-6 py-3 text-right">
                        <button className="text-xs text-neutral-500 hover:text-red-600 font-medium">Disable</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </section>

        </div>

        {/* Right Column (Narrow) */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Pricing Summary */}
          <section className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
               <DollarSign size={18} className="text-neutral-400" />
               <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Current Price</h2>
             </div>
             
             <div className="mb-6">
                <div className="text-4xl font-bold text-neutral-900 font-mono tracking-tight">
                  ${product.defaultPrice?.unitAmount || product.defaultPrice?.amount}
                  <span className="text-base text-neutral-500 font-normal ml-1">
                     {product.defaultPrice?.currency}
                     {product.revenueModel !== 'one_time' && '/mo'}
                  </span>
                </div>
                {product.revenueModel === 'usage_based' && (
                  <div className="text-xs text-neutral-500 mt-1">per {product.defaultPrice?.usageUnitName}</div>
                )}
             </div>

             <div className="pt-4 border-t border-neutral-100">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-500 font-medium">Default Plan</span>
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">Active</span>
               </div>
             </div>
          </section>

          {/* Pricing Agent Insight */}
          <section className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-2 mb-4">
               <Sparkles size={18} className="text-amber-500" />
               <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Pricing Recommendation</h2>
             </div>

             <div className="relative z-10 space-y-4">
               <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-500 uppercase tracking-wide">Typical Price</span>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">High Confidence</span>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 font-mono">
                    ${typicalPrice.toFixed(2)}
                  </div>
               </div>

               <div>
                 <div className="flex items-center justify-between text-sm mb-2">
                   <span className="text-neutral-600">Adoption Status</span>
                   <span className="font-medium text-amber-700">Modified ({deviation > 0 ? '+' : ''}{deviation.toFixed(0)}%)</span>
                 </div>
                 <p className="text-xs text-neutral-500 leading-relaxed">
                   Your price is <strong className="text-neutral-900">{Math.abs(deviation).toFixed(0)}% {deviation > 0 ? 'higher' : 'lower'}</strong> than the typical recommendation.
                 </p>
               </div>
               
               <div className="pt-2">
                 <button className="w-full text-xs font-medium text-neutral-900 border border-neutral-200 bg-white px-3 py-2 rounded hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1">
                   View History & Rationale
                   <ArrowLeft size={12} className="rotate-180" />
                 </button>
               </div>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
