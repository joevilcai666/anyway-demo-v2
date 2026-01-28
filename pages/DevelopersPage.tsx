import React, { useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Ban,
  ExternalLink,
  Send,
  Settings,
  BookOpen,
  Key,
  Clock,
} from 'lucide-react';
import {
  ApiKey,
  ApiKeyType,
  ApiKeyStatus,
  ApiKeyPermission,
  Webhook,
} from '../types';
import {
  INITIAL_SDK_KEYS,
  INITIAL_WEBHOOKS,
  formatDate,
  MASK_CHAR,
} from '../constants';
import { generateMockApiKey } from '../utils';
import Button from '../components/Button';
import Modal from '../components/Modal';

const DevelopersPage: React.FC = () => {
  // API Keys State
  const [sdkKeys, setSdkKeys] = useState<ApiKey[]>(INITIAL_SDK_KEYS);

  // Webhooks State
  const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL_WEBHOOKS);

  // API Key Modal State
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState(false);
  const [createKeyStep, setCreateKeyStep] = useState<1 | 2>(1);
  const [newKeyData, setNewKeyData] = useState<{
    name: string;
    description: string;
    permissions: ApiKeyPermission[];
    expiresAt?: string;
  }>({
    name: '',
    description: '',
    permissions: ['read'],
    expiresAt: undefined,
  });
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);

  // Webhook Modal State
  const [isCreateWebhookModalOpen, setIsCreateWebhookModalOpen] = useState(false);
  const [newWebhookData, setNewWebhookData] = useState({
    url: '',
    events: [] as string[],
  });

  // UI State
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [showWebhookSecretId, setShowWebhookSecretId] = useState<string | null>(
    null
  );

  // --- API Key Actions ---

  const handleCreateKeyOpen = () => {
    setNewKeyData({
      name: '',
      description: '',
      permissions: ['read'],
      expiresAt: undefined,
    });
    setCreateKeyStep(1);
    setCreatedKey(null);
    setIsCreateKeyModalOpen(true);
  };

  const generateKey = () => {
    // Mock API Call
    setTimeout(() => {
      const randomPart = generateMockApiKey().replace('sk_live_', '');

      const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        name: newKeyData.name || 'New API Key',
        description: newKeyData.description,
        token: `sk_live_${randomPart}`,
        type: ApiKeyType.SDK,
        status: ApiKeyStatus.ACTIVE,
        permissions: newKeyData.permissions,
        expiresAt: newKeyData.expiresAt ? newKeyData.expiresAt : null,
        created: new Date().toISOString(),
        lastUsed: null,
        usageCount: 0,
      };

      setSdkKeys([newKey, ...sdkKeys]);
      setCreatedKey(newKey);
      setCreateKeyStep(2);
    }, 600);
  };

  const togglePermission = (permission: ApiKeyPermission) => {
    setNewKeyData((prev) => {
      if (prev.permissions.includes(permission)) {
        // Don't allow removing all permissions
        if (prev.permissions.length === 1) {
          return prev;
        }
        return {
          ...prev,
          permissions: prev.permissions.filter((p) => p !== permission),
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permission],
        };
      }
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItemId(id);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  const handleRevokeKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key?')) {
      setSdkKeys(sdkKeys.map((k) =>
        k.id === id ? { ...k, status: ApiKeyStatus.INACTIVE } : k
      ));
    }
  };

  const handleDeleteKey = (id: string) => {
    if (
      confirm(
        'Are you sure you want to delete this API key? This action cannot be undone.'
      )
    ) {
      setSdkKeys(sdkKeys.filter((k) => k.id !== id));
    }
  };

  // --- Webhook Actions ---

  const handleCreateWebhookOpen = () => {
    setNewWebhookData({ url: '', events: [] });
    setIsCreateWebhookModalOpen(true);
  };

  const handleCreateWebhook = () => {
    const newWebhook: Webhook = {
      id: `wh_${Date.now()}`,
      url: newWebhookData.url,
      events: newWebhookData.events,
      secret: `whsec_${generateMockApiKey().replace('sk_live_', '')}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastTriggered: null,
    };

    setWebhooks([...webhooks, newWebhook]);
    setIsCreateWebhookModalOpen(false);
  };

  const handleTestWebhook = (webhook: Webhook) => {
    // Mock test webhook call
    setTimeout(() => {
      alert(`Test webhook sent to ${webhook.url}`);
    }, 500);
  };

  const handleDeleteWebhook = (id: string) => {
    if (
      confirm(
        'Are you sure you want to delete this webhook? This action cannot be undone.'
      )
    ) {
      setWebhooks(webhooks.filter((w) => w.id !== id));
    }
  };

  const toggleWebhookEvent = (event: string) => {
    setNewWebhookData((prev) => {
      if (prev.events.includes(event)) {
        return {
          ...prev,
          events: prev.events.filter((e) => e !== event),
        };
      } else {
        return {
          ...prev,
          events: [...prev.events, event],
        };
      }
    });
  };

  const WEBHOOK_EVENTS = [
    { id: 'agent.created', label: 'Agent Created', description: 'When an agent is created' },
    { id: 'agent.started', label: 'Agent Started', description: 'When an agent starts execution' },
    { id: 'agent.completed', label: 'Agent Completed', description: 'When an agent completes successfully' },
    { id: 'agent.failed', label: 'Agent Failed', description: 'When an agent encounters an error' },
    { id: 'payment.succeeded', label: 'Payment Succeeded', description: 'When a payment is processed' },
    { id: 'webhook.test', label: 'Test Webhook', description: 'Test event for development' },
  ];

  // --- Components ---

  const ApiKeysTable: React.FC<{ keys: ApiKey[] }> = ({ keys }) => {
    if (keys.length === 0) {
      return (
        <div className="border border-dashed border-neutral-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-neutral-50/50">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
            <Key className="text-neutral-400" size={24} />
          </div>
          <p className="text-neutral-600 font-medium mb-4">
            No API keys yet
          </p>
          <Button variant="secondary" size="sm" onClick={handleCreateKeyOpen}>
            Create API key
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
              <th className="px-6 py-4">Permissions</th>
              <th className="px-6 py-4">Key</th>
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
                  <div>
                    <div className="font-medium text-neutral-900 mb-0.5">
                      {key.name}
                    </div>
                    {key.description && (
                      <div className="text-xs text-neutral-500">{key.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {key.permissions?.map((perm) => (
                      <span
                        key={perm}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-neutral-600">
                      {showKeyId === key.id
                        ? key.token
                        : `${key.token.substring(0, 8)}${MASK_CHAR.repeat(
                            24
                          )}`}
                    </span>
                    <button
                      onClick={() =>
                        setShowKeyId(showKeyId === key.id ? null : key.id)
                      }
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      {showKeyId === key.id ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(key.token, key.id)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      {copiedItemId === key.id ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${
                      key.status === ApiKeyStatus.ACTIVE
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    {key.status === ApiKeyStatus.ACTIVE ? 'Active' : 'Revoked'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">
                  {formatDate(key.created)}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">
                  {key.lastUsed ? formatDate(key.lastUsed) : 'Never'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block text-left group/menu">
                    <button className="text-neutral-400 hover:text-neutral-600 p-1 rounded-md">
                      <MoreHorizontal size={18} />
                    </button>
                    <div className="hidden group-hover/menu:block absolute right-0 mt-0 w-32 bg-white rounded-md shadow-lg border border-neutral-100 z-10">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 first:rounded-t-md"
                        onClick={() => handleRevokeKey(key.id)}
                      >
                        {key.status === ApiKeyStatus.ACTIVE
                          ? 'Revoke'
                          : 'Activate'}
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-md"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        Delete
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

  const WebhooksTable: React.FC<{ hooks: Webhook[] }> = ({ hooks }) => {
    if (hooks.length === 0) {
      return (
        <div className="border border-dashed border-neutral-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-neutral-50/50">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
            <Send className="text-neutral-400" size={24} />
          </div>
          <p className="text-neutral-600 font-medium mb-4">No webhooks yet</p>
          <Button variant="secondary" size="sm" onClick={handleCreateWebhookOpen}>
            Add webhook
          </Button>
        </div>
      );
    }

    return (
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <th className="px-6 py-4">URL</th>
              <th className="px-6 py-4">Events</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Last triggered</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {hooks.map((webhook) => (
              <tr
                key={webhook.id}
                className="hover:bg-neutral-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="font-mono text-sm text-neutral-600 truncate max-w-xs">
                      {webhook.url}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-neutral-400">
                        {showWebhookSecretId === webhook.id
                          ? webhook.secret
                          : `${webhook.secret.substring(
                              0,
                              10
                            )}${MASK_CHAR.repeat(10)}`}
                      </span>
                      <button
                        onClick={() =>
                          setShowWebhookSecretId(
                            showWebhookSecretId === webhook.id ? null : webhook.id
                          )
                        }
                        className="text-neutral-400 hover:text-neutral-600"
                      >
                        {showWebhookSecretId === webhook.id ? (
                          <EyeOff size={12} />
                        ) : (
                          <Eye size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {webhook.events.slice(0, 2).map((event) => (
                      <span
                        key={event}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        {event}
                      </span>
                    ))}
                    {webhook.events.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700">
                        +{webhook.events.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${
                      webhook.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    {webhook.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">
                  {formatDate(webhook.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">
                  {webhook.lastTriggered
                    ? formatDate(webhook.lastTriggered)
                    : 'Never'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleTestWebhook(webhook)}
                    >
                      Test
                    </Button>
                    <div className="relative inline-block text-left group/menu">
                      <button className="text-neutral-400 hover:text-neutral-600 p-1 rounded-md">
                        <MoreHorizontal size={18} />
                      </button>
                      <div className="hidden group-hover/menu:block absolute right-0 mt-0 w-32 bg-white rounded-md shadow-lg border border-neutral-100 z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 first:rounded-t-md last:rounded-b-md"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                        >
                          Delete
                        </button>
                      </div>
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">
              Developer Settings
            </h1>
            <p className="text-neutral-500 max-w-2xl">
              Manage API keys, configure webhooks, and integrate with our
              services.
            </p>
          </div>
          <Button icon={<Plus size={18} />} onClick={handleCreateKeyOpen}>
            Create API key
          </Button>
        </div>

        {/* API Documentation Links */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900">
                API Documentation
              </h2>
              <p className="text-sm text-neutral-500">
                Get started with our developer resources
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <a
              href="https://docs.anyway.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              API Reference <ExternalLink size={16} />
            </a>
            <a
              href="https://docs.anyway.ai/quickstart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Quick Start Guide <ExternalLink size={16} />
            </a>
            <a
              href="https://docs.anyway.ai/webhooks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Webhooks Guide <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* API Keys Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="text-neutral-600" size={20} />
            <h2 className="text-lg font-semibold text-neutral-900">API Keys</h2>
          </div>
          <ApiKeysTable keys={sdkKeys} />
        </section>

        {/* Webhooks Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="text-neutral-600" size={20} />
              <h2 className="text-lg font-semibold text-neutral-900">
                Webhooks
              </h2>
            </div>
            <Button variant="secondary" size="sm" onClick={handleCreateWebhookOpen}>
              Add webhook
            </Button>
          </div>
          <WebhooksTable hooks={webhooks} />
        </section>
      </div>

      {/* CREATE API KEY MODAL */}
      <Modal
        isOpen={isCreateKeyModalOpen}
        onClose={() => setIsCreateKeyModalOpen(false)}
        title={createKeyStep === 1 ? 'Create new API key' : ''}
      >
        {createKeyStep === 1 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) =>
                    setNewKeyData({ ...newKeyData, name: e.target.value })
                  }
                  placeholder="e.g. Production Server"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  autoFocus
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description <span className="text-neutral-400">(optional)</span>
                </label>
                <textarea
                  value={newKeyData.description}
                  onChange={(e) =>
                    setNewKeyData({
                      ...newKeyData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of this key's purpose"
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                />
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newKeyData.permissions.includes('read')}
                      onChange={() => togglePermission('read')}
                      className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-neutral-700">
                      <span className="font-medium">Read</span> - View data and
                      resources
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newKeyData.permissions.includes('write')}
                      onChange={() => togglePermission('write')}
                      className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-neutral-700">
                      <span className="font-medium">Write</span> - Create and
                      modify resources
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newKeyData.permissions.includes('admin')}
                      onChange={() => togglePermission('admin')}
                      className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-neutral-700">
                      <span className="font-medium">Admin</span> - Full access
                      including manage other keys
                    </span>
                  </label>
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Expiration Date <span className="text-neutral-400">(optional)</span>
                </label>
                <input
                  type="date"
                  value={newKeyData.expiresAt || ''}
                  onChange={(e) =>
                    setNewKeyData({
                      ...newKeyData,
                      expiresAt: e.target.value || undefined,
                    })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <Button
                variant="secondary"
                onClick={() => setIsCreateKeyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={generateKey} disabled={!newKeyData.name.trim()}>
                Create API key
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center pt-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-neutral-900">
                Your New API Key
              </h3>
              <p className="text-neutral-500 text-sm px-4">
                Please copy and store this key somewhere safe. For security
                reasons,{' '}
                <span className="font-semibold text-neutral-700">
                  you won't be able to see it again.
                </span>
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex items-center gap-3 text-left">
              <code className="flex-1 font-mono text-sm text-neutral-800 break-all">
                {createdKey?.token}
              </code>
              <button
                onClick={() =>
                  createdKey &&
                  copyToClipboard(createdKey.token, 'modal-key')
                }
                className="p-2 hover:bg-white rounded-md text-neutral-500 hover:text-neutral-900 transition-colors border border-transparent hover:border-neutral-200 hover:shadow-sm"
              >
                {copiedItemId === 'modal-key' ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button className="text-sm text-neutral-500 hover:text-neutral-900 font-medium underline decoration-neutral-300 underline-offset-4">
                Download as .env snippet
              </button>
              <Button size="lg" className="w-full" onClick={() => setIsCreateKeyModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* CREATE WEBHOOK MODAL */}
      <Modal
        isOpen={isCreateWebhookModalOpen}
        onClose={() => setIsCreateWebhookModalOpen(false)}
        title="Add webhook"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={newWebhookData.url}
                onChange={(e) =>
                  setNewWebhookData({ ...newWebhookData, url: e.target.value })
                }
                placeholder="https://your-server.com/webhooks"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow font-mono text-sm"
                autoFocus
              />
              <p className="text-xs text-neutral-500 mt-1">
                Must be a publicly accessible HTTPS URL
              </p>
            </div>

            {/* Event Types */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Event Types
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {WEBHOOK_EVENTS.map((event) => (
                  <label
                    key={event.id}
                    className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      checked={newWebhookData.events.includes(event.id)}
                      onChange={() => toggleWebhookEvent(event.id)}
                      className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm text-neutral-700 block">
                        {event.label}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {event.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              variant="secondary"
              onClick={() => setIsCreateWebhookModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateWebhook}
              disabled={!newWebhookData.url.trim() || newWebhookData.events.length === 0}
            >
              Add webhook
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DevelopersPage;
