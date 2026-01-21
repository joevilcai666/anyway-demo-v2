import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Zap,
  Box,
  Coins,
  Search,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronRight,
  Bot
} from 'lucide-react';
import Button from '../components/Button';
import SlideOver from '../components/SlideOver';
import Modal from '../components/Modal';
import { SAMPLE_DELIVERIES, formatDateTime } from '../constants';
import { Delivery, DeliveryStatus, Step } from '../types';
import { generateMockApiKey } from '../utils';

const CONNECT_STEPS = [
  { n: 1, label: 'Get API Key' },
  { n: 2, label: 'Install SDK' },
  { n: 3, label: 'Test Trace' },
] as const;

const DashboardPage: React.FC = () => {
  // --- State ---
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>(SAMPLE_DELIVERIES);
  
  // Selection
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  // Tree View State
  const [expandedStepIds, setExpandedStepIds] = useState<Set<string>>(new Set());

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');

  // Connect Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectStep, setConnectStep] = useState<1 | 2 | 3>(1);
  const [generatedKey, setGeneratedKey] = useState('');
  const [isSendingTrace, setIsSendingTrace] = useState(false);

  // --- Effects ---

  // When onboarded, switch to live data mode
  useEffect(() => {
    setDeliveries(isOnboarded ? [SAMPLE_DELIVERIES[0]] : SAMPLE_DELIVERIES);
  }, [isOnboarded]);

  // Reset tree expansion when delivery changes
  useEffect(() => {
    if (selectedDelivery) {
      setExpandedStepIds(new Set());
    }
  }, [selectedDelivery]);

  // --- Handlers ---

  const handleConnectOpen = () => {
    setConnectStep(1);
    setIsConnectModalOpen(true);
  };

  const handleGenerateKey = () => {
    setGeneratedKey(generateMockApiKey());
  };

  const handleSendTestTrace = () => {
    setIsSendingTrace(true);
    setTimeout(() => {
      setIsSendingTrace(false);
      setIsOnboarded(true);
      setIsConnectModalOpen(false);
      setSelectedDelivery(SAMPLE_DELIVERIES[0]);
    }, 1500);
  };

  const toggleStepExpand = (stepId: string) => {
    const newSet = new Set(expandedStepIds);
    if (newSet.has(stepId)) {
      newSet.delete(stepId);
    } else {
      newSet.add(stepId);
    }
    setExpandedStepIds(newSet);
  };

  const filteredDeliveries = deliveries.filter(d => {
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  // Calculate visible steps for the tree
  const visibleSteps = useMemo(() => {
    if (!selectedDelivery) return [];
    
    const visible: Step[] = [];
    const visibleIds = new Set<string>();
  
    selectedDelivery.steps.forEach(step => {
      let isVisible = false;
      if (step.depth === 0) {
        isVisible = true;
      } else if (step.parentId && visibleIds.has(step.parentId) && expandedStepIds.has(step.parentId)) {
        isVisible = true;
      }
      
      if (isVisible) {
        visibleIds.add(step.id);
        visible.push(step);
      }
    });
    return visible;
  }, [selectedDelivery, expandedStepIds]);

  // --- Helper Components ---

  const StatusBadge = ({ status }: { status: DeliveryStatus }) => {
    const styles = {
      success: 'bg-green-50 text-green-700 border-green-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
      running: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    
    const labels = {
      success: 'Success',
      failed: 'Failed',
      running: 'Running',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status === 'success' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />}
        {status === 'failed' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />}
        {status === 'running' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse" />}
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="flex-1 bg-[#FAFAFA] h-full flex flex-col overflow-hidden">
      
      {/* Onboarding Banner */}
      {!isOnboarded && (
        <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
             <div className="bg-brand-yellow/20 p-1.5 rounded-md border border-brand-yellow/30">
                <Box size={16} className="text-neutral-800" />
             </div>
             <p className="text-sm text-neutral-900">
               <span className="font-semibold mr-1">You’re viewing sample data.</span> 
               Connect Python SDK to see your first live Delivery trace.
             </p>
          </div>
          <Button onClick={handleConnectOpen} size="sm" className="shadow-none">Connect Python SDK</Button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Dashboard</h1>
            
            <div className="flex items-center gap-3">
              {/* Date Picker Mock */}
              <button
                type="button"
                aria-label="Select date range: Last 24 hours, Oct 26, 10:00 - Oct 27, 10:00"
                className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 shadow-sm hover:border-neutral-300 transition-colors"
              >
                <Clock size={16} aria-hidden="true" />
                <span className="font-medium">Last 24 hours</span>
                <span className="text-neutral-300" aria-hidden="true">|</span>
                <span className="text-neutral-400 text-xs">Oct 26, 10:00 - Oct 27, 10:00</span>
              </button>

              {/* Status Filter */}
              <div role="group" aria-label="Filter by status" className="flex items-center bg-white border border-neutral-200 rounded-lg p-1 shadow-sm">
                {(['all', 'success', 'failed'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    aria-pressed={statusFilter === s}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize
                      ${statusFilter === s ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Table */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  <th className="px-6 py-4 w-32">Delivery ID</th>
                  <th className="px-6 py-4 w-48">Timestamp</th>
                  <th className="px-6 py-4">Agent</th>
                  <th className="px-6 py-4 w-32">Status</th>
                  <th className="px-6 py-4 w-24">Steps</th>
                  <th className="px-6 py-4 w-32">Tokens</th>
                  <th className="px-6 py-4 w-32">Cost</th>
                  <th className="px-6 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredDeliveries.map((delivery) => {
                  const shortId = delivery.id.split('_')[1] || delivery.id;
                  return (
                    <tr
                      key={delivery.id}
                      onClick={() => setSelectedDelivery(delivery)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedDelivery(delivery);
                        }
                      }}
                      tabIndex={0}
                      className="hover:bg-neutral-50 cursor-pointer transition-colors group"
                      role="button"
                      aria-label={`View delivery ${shortId} details`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200" aria-label={`Delivery ID: ${delivery.id}`}>
                          {shortId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 tabular-nums">
                        {formatDateTime(delivery.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-neutral-900">{delivery.agentName}</span>
                          <span className="text-xs text-neutral-500">{delivery.userEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={delivery.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 pl-8">
                        {delivery.stepCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 tabular-nums font-mono">
                        {delivery.totalTokens.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 tabular-nums font-mono">
                        ${delivery.totalCost.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Trace
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredDeliveries.length === 0 && (
              <div className="p-12 text-center text-neutral-500 flex flex-col items-center">
                <Search size={32} className="text-neutral-300 mb-2" />
                <p>No deliveries found matching your filters.</p>
              </div>
            )}
            
            {/* Pagination Footer */}
            {filteredDeliveries.length > 0 && (
              <div className="px-6 py-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                 <span className="text-xs text-neutral-500">Showing {filteredDeliveries.length} results</span>
                 <div className="flex gap-2">
                   <button className="px-3 py-1 text-xs border border-neutral-200 bg-white rounded hover:bg-neutral-50 disabled:opacity-50 text-neutral-600" disabled>Previous</button>
                   <button className="px-3 py-1 text-xs border border-neutral-200 bg-white rounded hover:bg-neutral-50 disabled:opacity-50 text-neutral-600" disabled>Next</button>
                 </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- DELIVERY DETAILS SLIDEOVER --- */}
      <SlideOver 
        isOpen={!!selectedDelivery} 
        onClose={() => setSelectedDelivery(null)}
        width="max-w-2xl"
        headerContent={selectedDelivery ? (
          <div className="flex items-center gap-3">
             <h3 className="text-xl font-bold text-neutral-900 font-mono">{selectedDelivery.id}</h3>
             <StatusBadge status={selectedDelivery.status} />
          </div>
        ) : null}
        subHeaderContent={selectedDelivery ? (
          <div className="grid grid-cols-3 border-t border-neutral-200 bg-neutral-50/30">
             {/* Cost */}
             <div className="flex flex-col items-center py-3 border-r border-neutral-200">
               <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-1">Total Cost</span>
               <span className="font-mono text-lg font-bold text-neutral-900">${selectedDelivery.totalCost.toFixed(5)}</span>
             </div>
             {/* Duration */}
             <div className="flex flex-col items-center py-3 border-r border-neutral-200">
               <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-1">Duration</span>
               <span className="font-mono text-lg font-bold text-neutral-900">{selectedDelivery.duration}</span>
             </div>
             {/* Tokens */}
             <div className="flex flex-col items-center py-3">
               <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-1">Tokens</span>
               <span className="font-mono text-lg font-bold text-neutral-900">{selectedDelivery.totalTokens.toLocaleString()}</span>
             </div>
          </div>
        ) : null}
      >
        {selectedDelivery && (
          <div className="flex flex-col h-full bg-[#FAFAFA]">
            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto">
              
              {/* Execution Trace (Tree + Waterfall) */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 px-1">
                   <h3 className="text-sm font-bold text-neutral-900">Execution Trace</h3>
                </div>
                
                {/* Headers for Trace Table */}
                <div className="flex items-center text-xs font-semibold text-neutral-400 pb-2 px-3 border-b border-neutral-100 mb-2">
                   <div className="flex-1 pl-6">Step</div>
                   <div className="w-24 text-right">Tokens</div>
                   <div className="w-24 text-right">Cost</div>
                   <div className="w-24 text-right">Duration</div>
                </div>

                <div className="relative ml-3 pl-0 space-y-0">
                  {visibleSteps.map((step) => {
                     // Check if this step has children
                     const hasChildren = selectedDelivery.steps.some(s => s.parentId === step.id);
                     
                     return (
                       <TraceStepRow 
                          key={step.id} 
                          step={step} 
                          steps={selectedDelivery.steps}
                          hasChildren={hasChildren}
                          isTreeExpanded={expandedStepIds.has(step.id)}
                          onToggleTreeExpand={() => toggleStepExpand(step.id)}
                       />
                     );
                  })}
                </div>
              </div>

              {/* Artifacts (Bottom) */}
              {selectedDelivery.artifacts && selectedDelivery.artifacts.length > 0 && (
                <div className="px-6 pb-8">
                   <h3 className="text-sm font-bold text-neutral-900 mb-4 px-1">Artifacts</h3>
                   <div className="grid grid-cols-1 gap-3">
                      {selectedDelivery.artifacts.map((art, i) => (
                        <div
                          key={i}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              // Handle artifact click
                            }
                          }}
                          className="flex items-center p-3 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors group cursor-pointer"
                          aria-label={`View artifact: ${art.name}`}
                        >
                           <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center mr-3 text-neutral-500 group-hover:text-neutral-900" aria-hidden="true">
                             <FileText size={20} />
                           </div>
                           <div className="flex-1">
                             <div className="text-sm font-semibold text-neutral-900">{art.name}</div>
                             <div className="text-xs text-neutral-500">Document</div>
                           </div>
                           <ExternalLink size={16} className="text-neutral-300 group-hover:text-neutral-500" aria-hidden="true" />
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </SlideOver>

      {/* --- CONNECT SDK MODAL --- */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        width="max-w-2xl"
      >
        <div className="py-2">
           {/* Steps Header */}
           <div className="flex items-center justify-between mb-8 px-8">
              {CONNECT_STEPS.map((s) => (
                <div key={s.n} className="flex flex-col items-center gap-2 relative z-10 w-24">
                   <div className={`
                     w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                     ${connectStep > s.n 
                       ? 'bg-green-500 text-white shadow-md' 
                       : connectStep === s.n 
                         ? 'bg-brand-yellow text-neutral-900 ring-2 ring-brand-yellow ring-offset-2' 
                         : 'bg-neutral-100 text-neutral-400'}
                   `}>
                     {connectStep > s.n ? <Check size={16} /> : s.n}
                   </div>
                   <span className={`text-xs font-medium ${connectStep === s.n ? 'text-neutral-900' : 'text-neutral-400'}`}>
                     {s.label}
                   </span>
                </div>
              ))}
              {/* Connecting Lines */}
              <div className="absolute left-0 right-0 top-[2.75rem] h-0.5 bg-neutral-100 -z-0 mx-16" />
              <div
                className="absolute left-0 top-[2.75rem] h-0.5 bg-green-500 -z-0 mx-16 transition-all duration-500"
                style={{ width: connectStep === 1 ? '0%' : connectStep === 2 ? '50%' : '100%' }}
              />
           </div>

           {/* Step Content */}
           <div className="min-h-[320px] flex flex-col justify-between">

              {/* Step 1: API Key */}
              {connectStep === 1 && (
                <div className="space-y-6 px-4 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="text-center">
                     <h3 className="text-xl font-bold text-neutral-900 mb-2">Create your Secret Key</h3>
                     <p className="text-neutral-500">You need a secret key to authenticate your agent's requests.</p>
                   </div>
                   
                   {!generatedKey ? (
                     <div className="flex justify-center py-8">
                       <Button onClick={handleGenerateKey} size="lg">Generate Secret Key</Button>
                     </div>
                   ) : (
                     <div className="space-y-4 max-w-lg mx-auto w-full">
                       <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-1 flex items-center">
                         <code className="flex-1 font-mono text-sm text-neutral-800 break-all px-3 py-2" aria-label={`API Key: ${generatedKey}`}>{generatedKey}</code>
                         <button
                           aria-label="Copy API key to clipboard"
                           className="p-2 hover:bg-white rounded text-neutral-500 hover:text-neutral-900 transition-colors shadow-sm"
                           onClick={() => navigator.clipboard.writeText(generatedKey)}
                         >
                            <Copy size={18} />
                         </button>
                       </div>
                       <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded border border-amber-100 flex items-start gap-2">
                         <span className="font-bold">Important:</span> This key will only be shown once. Please copy it now.
                       </p>
                     </div>
                   )}
                </div>
              )}

              {/* Step 2: Install */}
              {connectStep === 2 && (
                <div className="space-y-8 px-4 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="text-center">
                     <h3 className="text-xl font-bold text-neutral-900 mb-2">Install the SDK</h3>
                     <p className="text-neutral-500">Run this command in your terminal.</p>
                   </div>

                   <div className="max-w-lg mx-auto w-full space-y-4">
                      <div className="bg-neutral-900 rounded-xl p-4 shadow-lg text-neutral-100 font-mono text-sm flex items-center justify-between group">
                        <span className="text-green-400 mr-2" aria-hidden="true">$</span>
                        <span className="flex-1">pip install anyway-sdk</span>
                        <button
                          aria-label="Copy install command"
                          className="text-neutral-500 group-hover:text-white transition-colors"
                          onClick={() => navigator.clipboard.writeText('pip install anyway-sdk')}
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm px-1">
                         <a href="#" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors">
                           <FileText size={14} /> View API Docs
                         </a>
                         <a href="#" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                           Troubleshooting install
                         </a>
                      </div>
                   </div>
                </div>
              )}

              {/* Step 3: Test Trace */}
              {connectStep === 3 && (
                <div className="space-y-6 px-4 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="text-center">
                     <h3 className="text-xl font-bold text-neutral-900 mb-2">Send a Test Trace</h3>
                     <p className="text-neutral-500">Trigger your agent code to send a test event.</p>
                   </div>

                   <div className="flex items-center justify-center py-4">
                      {isSendingTrace ? (
                        <div className="flex flex-col items-center gap-4 py-4">
                          <div className="relative">
                             <div className="w-16 h-16 border-4 border-neutral-100 rounded-full"></div>
                             <div className="absolute top-0 left-0 w-16 h-16 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <div className="text-center space-y-1">
                             <span className="text-sm font-semibold text-neutral-900 block">Listening for events...</span>
                             <span className="text-xs text-neutral-500 block">This usually takes a few seconds</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 flex flex-col items-center gap-3 text-center max-w-sm">
                           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100">
                              <Zap size={24} className="text-neutral-400" />
                           </div>
                           <p className="text-sm text-neutral-600">
                             We’ll confirm everything is working when you send your first trace.
                           </p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex justify-between items-center pt-8 border-t border-neutral-100 mt-4 px-6">
                 {connectStep > 1 ? (
                   <button 
                     onClick={() => setConnectStep(s => s - 1 as any)}
                     className="text-neutral-500 hover:text-neutral-900 text-sm font-medium"
                   >
                     Back
                   </button>
                 ) : <div></div>}

                 <div className="flex gap-3">
                   {connectStep < 3 ? (
                     <Button 
                       onClick={() => setConnectStep(s => s + 1 as any)} 
                       disabled={connectStep === 1 && !generatedKey}
                     >
                       Continue
                     </Button>
                   ) : (
                     <Button 
                       onClick={handleSendTestTrace} 
                       disabled={isSendingTrace}
                     >
                       {isSendingTrace ? 'Waiting...' : 'Simulate Test Trace'}
                     </Button>
                   )}
                 </div>
              </div>
           </div>
        </div>
      </Modal>

    </div>
  );
};

// --- Sub-Component: Trace Step Row (Tree Table) ---

interface TraceStepRowProps { 
  step: Step; 
  steps: Step[];
  hasChildren: boolean;
  isTreeExpanded: boolean;
  onToggleTreeExpand: () => void;
}

const TraceStepRow: React.FC<TraceStepRowProps> = ({ 
  step, 
  steps,
  hasChildren,
  isTreeExpanded,
  onToggleTreeExpand
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const isFailed = step.status === 'failed';

  // --- Guide Lines Logic ---
  const isLastChild = (s: Step, allSteps: Step[]) => {
    const siblings = allSteps.filter(sib => sib.parentId === s.parentId);
    if (siblings.length === 0) return true;
    return siblings[siblings.length - 1].id === s.id;
  };
  const isCurrentLast = isLastChild(step, steps);

  const ancestorsMap = useMemo(() => {
    const map = new Map<number, Step>();
    let curr = step;
    while (curr.parentId) {
       const parent = steps.find(s => s.id === curr.parentId);
       if (parent) {
         map.set(parent.depth, parent);
         curr = parent;
       } else {
         break;
       }
    }
    return map;
  }, [step, steps]);

  const INDENT_SIZE = 24; // px

   return (
     <div className="relative group">
      {/* Guide Lines Container */}
      <div className="absolute top-0 bottom-0 left-0 flex pointer-events-none select-none z-0" style={{ width: (step.depth + 1) * INDENT_SIZE + 24 }}>
         {/* Ancestor Lines */}
         {Array.from({ length: step.depth }).map((_, i) => {
            const ancestor = ancestorsMap.get(i);
            const isAncestorLast = ancestor ? isLastChild(ancestor, steps) : true;
            if (isAncestorLast) return <div key={i} style={{ width: INDENT_SIZE }} />;

            return (
               <div key={i} style={{ width: INDENT_SIZE }} className="relative">
                  <div className="absolute top-0 bottom-0 right-0 w-px bg-neutral-200 -mr-px" />
               </div>
            );
         })}

         {/* Current Step Connector */}
         <div style={{ width: INDENT_SIZE }} className="relative">
            {step.depth > 0 ? (
               <>
                 <div className="absolute top-0 h-1/2 left-0 w-px bg-neutral-200 -ml-px" />
                 <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-200" />
                 {!isCurrentLast && (
                    <div className="absolute top-1/2 bottom-0 left-0 w-px bg-neutral-200 -ml-px" />
                 )}
               </>
            ) : (
               <div className={`absolute top-0 right-0 w-px bg-neutral-200 -mr-px ${isCurrentLast ? 'h-1/2' : 'bottom-0'}`} />
            )}
         </div>
      </div>

      {/* Content Container */}
      <div
         className={`relative transition-all duration-200 rounded-lg border border-transparent z-10
           ${isDetailsExpanded ? 'bg-neutral-50 border-neutral-200' : 'hover:bg-neutral-50 hover:border-neutral-200'}
         `}
         style={{ paddingLeft: step.depth * INDENT_SIZE }}
      >
        {/* Row Header */}
        <div
          className="flex items-center py-3 pr-4 cursor-pointer"
          onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
        >

           {/* Tree Toggle & Icon Area */}
           <div
             className="flex items-center justify-center mr-3 relative z-10 w-12 h-6 cursor-pointer"
             onClick={(e) => {
               if (hasChildren) {
                 e.stopPropagation();
                 onToggleTreeExpand();
               }
             }}
             role="button"
             tabIndex={0}
             aria-expanded={isTreeExpanded}
             onKeyDown={(e) => {
               if ((e.key === 'Enter' || e.key === ' ') && hasChildren) {
                 e.preventDefault();
                 e.stopPropagation();
                 onToggleTreeExpand();
               }
             }}
           >
              {hasChildren && (
                <div className="absolute -left-3 p-1 text-neutral-400 transition-colors hover:text-neutral-600" aria-hidden="true">
                  {isTreeExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </div>
              )}

              <div className={`
                 relative z-20 flex items-center justify-center rounded-full border shadow-sm transition-transform duration-200
                 ${hasChildren ? 'w-6 h-6 border-neutral-300 bg-white text-neutral-700' : 'w-5 h-5 border-neutral-200 bg-neutral-50 text-neutral-500'}
                 ${isFailed ? 'border-red-300 bg-red-50 text-red-600' : ''}
                 ${isDetailsExpanded ? 'scale-110 ring-2 ring-brand-yellow/50 border-brand-yellow' : ''}
              `}>
                  {step.type === 'llm' && <Bot size={hasChildren ? 14 : 12} />}
                  {step.type === 'tool' && <Terminal size={hasChildren ? 14 : 12} />}
                  {step.type === 'system' && <Box size={hasChildren ? 14 : 12} />}
                  {step.type === 'retrieval' && <Search size={hasChildren ? 14 : 12} />}
              </div>
           </div>

           {/* Name & Provider */}
           <div className="flex-1 min-w-0">
             <div className={`text-sm text-neutral-900 truncate ${hasChildren ? 'font-bold' : 'font-medium'}`}>
               {step.name}
             </div>
             {step.provider && (
               <div className="text-[10px] text-neutral-500 truncate flex items-center gap-1">
                 <span>{step.provider}</span>
                 {step.model && <span className="text-neutral-300">/</span>}
                 {step.model && <span className="font-mono text-neutral-600">{step.model}</span>}
               </div>
             )}
           </div>

           {/* Metrics */}
           <div className="flex items-center gap-0 text-right opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="w-24 font-mono text-[10px] text-neutral-500">
                {step.tokensTotal !== undefined ? `${step.tokensTotal.toLocaleString()}` : '-'}
              </div>
              <div className="w-24 font-mono text-xs font-medium text-neutral-900">
                {step.cost > 0 ? `$${step.cost.toFixed(5)}` : '-'}
              </div>
              <div className="w-24 font-mono text-xs text-neutral-500 mr-2">
                {step.durationLabel}
              </div>
           </div>
        </div>

        {/* Details Panel */}
        {isDetailsExpanded && (
          <div className="pb-4 pr-4 pl-12 sm:pl-14 animate-in slide-in-from-top-1 duration-200 relative cursor-default" onClick={(e) => e.stopPropagation()}>

             <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm space-y-4 mt-2">

                {/* Usage Breakdown */}
                {(step.tokensTotal !== undefined || step.tokensIn !== undefined) && (
                  <div>
                     <h4 className="text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-wider flex items-center gap-2">
                       <Coins size={12} /> Usage Breakdown
                     </h4>
                     <div className="grid grid-cols-3 gap-3">
                        <div className="bg-neutral-50 p-2 rounded border border-neutral-100">
                          <div className="text-[10px] text-neutral-500">Total Tokens</div>
                          <div className="text-sm font-bold text-neutral-900 font-mono">{step.tokensTotal?.toLocaleString() || 0}</div>
                        </div>
                        <div className="bg-neutral-50 p-2 rounded border border-neutral-100">
                          <div className="text-[10px] text-neutral-500">Input Tokens</div>
                          <div className="text-sm font-medium text-neutral-700 font-mono">{step.tokensIn?.toLocaleString() || 0}</div>
                        </div>
                        <div className="bg-neutral-50 p-2 rounded border border-neutral-100">
                          <div className="text-[10px] text-neutral-500">Output Tokens</div>
                          <div className="text-sm font-medium text-neutral-700 font-mono">{step.tokensOut?.toLocaleString() || 0}</div>
                        </div>
                     </div>
                  </div>
                )}

                {/* Configuration & I/O */}
                <div>
                   <h4 className="text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-wider">
                     Configuration & I/O
                   </h4>
                   <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden text-sm divide-y divide-neutral-100">
                      <div className="flex items-center px-4 py-3">
                         <div className="w-32 text-neutral-500 font-medium shrink-0">Model</div>
                         <div className="font-mono text-neutral-900">{step.model || '-'}</div>
                      </div>

                      {step.provider && (
                        <div className="flex items-center px-4 py-3">
                           <div className="w-32 text-neutral-500 font-medium shrink-0">Provider</div>
                           <div className="font-mono text-neutral-900">{step.provider}</div>
                        </div>
                      )}

                      {step.input && (
                        <div className="flex items-start px-4 py-3">
                           <div className="w-32 text-neutral-500 font-medium shrink-0 pt-1.5">Input</div>
                           <div className="flex-1 bg-neutral-50 rounded px-3 py-2 border border-neutral-100 font-mono text-xs text-neutral-700 overflow-x-auto max-h-40 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                              {step.input}
                           </div>
                        </div>
                      )}

                      {step.output && (
                        <div className="flex items-start px-4 py-3">
                           <div className="w-32 text-neutral-500 font-medium shrink-0 pt-1.5">Output</div>
                           <div className="flex-1 bg-neutral-50 rounded px-3 py-2 border border-neutral-100 font-mono text-xs text-neutral-700 overflow-x-auto max-h-60 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                              {step.output}
                           </div>
                        </div>
                      )}

                      {step.error && (
                        <div className="flex items-start px-4 py-3 bg-red-50/30">
                           <div className="w-32 text-red-500 font-medium shrink-0 pt-1.5">Error</div>
                           <div className="flex-1 bg-red-50 rounded px-3 py-2 border border-red-100 font-mono text-xs text-red-700 overflow-x-auto whitespace-pre-wrap">
                              {step.error}
                           </div>
                        </div>
                      )}
                   </div>
                </div>

                {/* Performance */}
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-wider">
                    Performance
                  </h4>
                  <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex divide-x divide-neutral-100">
                      <div className="flex-1 px-4 py-3">
                         <div className="text-xs text-neutral-500 mb-1">Finish Reason</div>
                         <div className="font-mono text-sm text-neutral-900">{step.finishReason || '-'}</div>
                      </div>

                      <div className="flex-1 px-4 py-3">
                         <div className="text-xs text-neutral-500 mb-1">Duration</div>
                         <div className="font-mono text-sm font-bold text-neutral-900">{step.durationMs}ms</div>
                      </div>

                      <div className="flex-1 px-4 py-3">
                         <div className="text-xs text-neutral-500 mb-1">Start Time</div>
                         <div className="font-mono text-sm text-neutral-900">
                           {step.startTime.split('T')[1]?.split('.')[0] || step.startTime}
                         </div>
                      </div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
