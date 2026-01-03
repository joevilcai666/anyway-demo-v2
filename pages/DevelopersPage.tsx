import React, { useState } from 'react';
import { Plus, MoreHorizontal, Copy, Check, Eye, EyeOff, Trash2, Ban } from 'lucide-react';
import { ApiKey, ApiKeyType, ApiKeyStatus } from '../types';
import { INITIAL_SDK_KEYS, INITIAL_PAYMENT_KEYS, formatDate, MASK_CHAR } from '../constants';
import Button from '../components/Button';
import Modal from '../components/Modal';

const DevelopersPage: React.FC = () => {
  const [sdkKeys, setSdkKeys] = useState<ApiKey[]>(INITIAL_SDK_KEYS);
  const [paymentKeys, setPaymentKeys] = useState<ApiKey[]>(INITIAL_PAYMENT_KEYS);
  
  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [newKeyData, setNewKeyData] = useState<{ name: string; type: ApiKeyType }>({ name: '', type: ApiKeyType.SDK });
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);
  
  // UI State for table interactions
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // --- Actions ---

  const handleCreateOpen = () => {
    setNewKeyData({ name: '', type: ApiKeyType.SDK });
    setCreateStep(1);
    setCreatedKey(null);
    setIsCreateModalOpen(true);
  };

  const generateKey = () => {
    // Mock API Call
    setTimeout(() => {
      const prefix = newKeyData.type === ApiKeyType.SDK ? 'sk_live_' : 'pk_live_';
      const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        name: newKeyData.name || (newKeyData.type === ApiKeyType.SDK ? 'New SDK Key' : 'New Payment Key'),
        type: newKeyData.type,
        token: `${prefix}${randomString}`,
        status: ApiKeyStatus.ACTIVE,
        created: new Date().toISOString(),
        lastUsed: null,
      };

      if (newKeyData.type === ApiKeyType.SDK) {
        setSdkKeys([newKey, ...sdkKeys]);
      } else {
        setPaymentKeys([newKey, ...paymentKeys]);
      }
      
      setCreatedKey(newKey);
      setCreateStep(2);
    }, 600);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleDelete = (id: string, type: ApiKeyType) => {
    if (confirm('Are you sure you want to revoke this key?')) {
      if (type === ApiKeyType.SDK) {
        setSdkKeys(sdkKeys.filter(k => k.id !== id));
      } else {
        setPaymentKeys(paymentKeys.filter(k => k.id !== id));
      }
    }
  };

  // --- Components ---

  const KeysTable: React.FC<{ keys: ApiKey[]; type: ApiKeyType; emptyMessage: string }> = ({ keys, type, emptyMessage }) => {
    if (keys.length === 0) {
      return (
        <div className="border border-dashed border-neutral-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-neutral-50/50">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
            <Ban className="text-neutral-400" size={24} />
          </div>
          <p className="text-neutral-600 font-medium mb-4">{emptyMessage}</p>
          <Button variant="secondary" size="sm" onClick={() => {
            setNewKeyData({ ...newKeyData, type: type });
            setCreateStep(1);
            setIsCreateModalOpen(true);
          }}>
            Create {type === ApiKeyType.SDK ? 'SDK' : 'Payment'} Key
          </Button>
        </div>
      );
    }

    return (
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Tokens</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Last used</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {keys.map((key) => (
              <tr key={key.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-medium text-neutral-900 cursor-pointer hover:underline decoration-dashed underline-offset-4 decoration-neutral-300">
                    {key.name}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-neutral-600">
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-neutral-900"
                    onClick={() => copyToClipboard(key.token, key.id)}
                  >
                    <span>{key.token.substring(0, 8)}{MASK_CHAR.repeat(12)}</span>
                    {copiedKeyId === key.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${key.status === ApiKeyStatus.ACTIVE 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}
                  >
                    {key.status === ApiKeyStatus.ACTIVE ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">
                  {formatDate(key.created)}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">
                  {formatDate(key.lastUsed)}
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="relative inline-block text-left group/menu">
                      <button className="text-neutral-400 hover:text-neutral-600 p-1 rounded-md">
                        <MoreHorizontal size={18} />
                      </button>
                      {/* Dropdown for Prototype */}
                      <div className="hidden group-hover/menu:block absolute right-0 mt-0 w-32 bg-white rounded-md shadow-lg border border-neutral-100 z-10">
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 first:rounded-t-md last:rounded-b-md"
                          onClick={() => handleDelete(key.id, key.type)}
                        >
                          Revoke
                        </button>
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#FAFAFA] min-h-screen p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">Developers</h1>
            <p className="text-neutral-500 max-w-2xl">
              Manage your API keys to authenticate SDK requests and access payment data securely.
            </p>
          </div>
          <Button icon={<Plus size={18} />} onClick={handleCreateOpen}>
            Create API key
          </Button>
        </div>

        {/* SDK Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">SDK API Keys</h2>
          </div>
          <KeysTable 
            keys={sdkKeys} 
            type={ApiKeyType.SDK} 
            emptyMessage="Create an API key to connect your SDK" 
          />
        </section>

        {/* Payment Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Payment API Keys</h2>
          </div>
          <KeysTable 
            keys={paymentKeys} 
            type={ApiKeyType.PAYMENT} 
            emptyMessage="Create an API key to connect your payment data" 
          />
        </section>
      </div>

      {/* CREATE KEY MODAL */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title={createStep === 1 ? "Create new API key" : ""}
      >
        {createStep === 1 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Key Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setNewKeyData({ ...newKeyData, type: ApiKeyType.SDK })}
                    className={`cursor-pointer border rounded-xl p-4 transition-all
                      ${newKeyData.type === ApiKeyType.SDK 
                        ? 'border-brand-yellow ring-1 ring-brand-yellow bg-yellow-50/20' 
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'}
                    `}
                  >
                    <div className="font-semibold text-neutral-900 mb-1">SDK Key</div>
                    <div className="text-xs text-neutral-500">Track agent usage and costs.</div>
                  </div>
                  <div 
                    onClick={() => setNewKeyData({ ...newKeyData, type: ApiKeyType.PAYMENT })}
                    className={`cursor-pointer border rounded-xl p-4 transition-all
                      ${newKeyData.type === ApiKeyType.PAYMENT 
                        ? 'border-brand-yellow ring-1 ring-brand-yellow bg-yellow-50/20' 
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'}
                    `}
                  >
                    <div className="font-semibold text-neutral-900 mb-1">Payment Key</div>
                    <div className="text-xs text-neutral-500">Query invoice and transaction data.</div>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
                <input 
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                  placeholder="e.g. Production Server"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition-shadow"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button onClick={generateKey}>Create secret key</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center pt-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-neutral-900">Your New API Key</h3>
              <p className="text-neutral-500 text-sm px-4">
                Please copy and store this key somewhere safe. For security reasons, 
                <span className="font-semibold text-neutral-700"> you won't be able to see it again.</span>
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex items-center gap-3 text-left">
              <code className="flex-1 font-mono text-sm text-neutral-800 break-all">
                {createdKey?.token}
              </code>
              <button 
                onClick={() => createdKey && copyToClipboard(createdKey.token, 'modal-key')}
                className="p-2 hover:bg-white rounded-md text-neutral-500 hover:text-neutral-900 transition-colors border border-transparent hover:border-neutral-200 hover:shadow-sm"
              >
                {copiedKeyId === 'modal-key' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
            </div>

            <div className="flex flex-col gap-3 pt-4">
               <button className="text-sm text-neutral-500 hover:text-neutral-900 font-medium underline decoration-neutral-300 underline-offset-4">
                Download as .env snippet
              </button>
              <Button size="lg" className="w-full" onClick={() => setIsCreateModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DevelopersPage;
