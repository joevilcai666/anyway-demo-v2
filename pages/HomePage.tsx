import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart3,
  Layout,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';
import Card from '../components/Card';

// Mock data for metrics
const METRICS = [
  {
    label: 'Total Revenue',
    value: '$12,450.00',
    change: '+15.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-50 text-green-600 border-green-200',
  },
  {
    label: 'Total Orders',
    value: '1,284',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    label: 'Active Products',
    value: '24',
    change: '+3',
    trend: 'up',
    icon: Package,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    label: 'Subscribers',
    value: '892',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
  },
];

// Mock data for recent activity
const RECENT_ORDERS = [
  {
    id: 'ORD-2847',
    customer: 'john@example.com',
    product: 'Weekly Business Report',
    amount: '$49.00',
    status: 'completed',
    time: '2 minutes ago',
  },
  {
    id: 'ORD-2846',
    customer: 'sarah@company.com',
    product: 'Market Analysis Report',
    amount: '$199.00',
    status: 'processing',
    time: '15 minutes ago',
  },
  {
    id: 'ORD-2845',
    customer: 'mike@startup.io',
    product: 'Monthly Financial Summary',
    amount: '$29.00',
    status: 'completed',
    time: '1 hour ago',
  },
  {
    id: 'ORD-2844',
    customer: 'emma@agency.com',
    product: 'Weekly Business Report',
    amount: '$49.00',
    status: 'failed',
    time: '2 hours ago',
  },
  {
    id: 'ORD-2843',
    customer: 'alex@enterprise.co',
    product: 'Custom Research Package',
    amount: '$499.00',
    status: 'completed',
    time: '3 hours ago',
  },
];

// Mock data for recent subscriptions
const RECENT_SUBSCRIPTIONS = [
  {
    customer: 'john@example.com',
    plan: 'Pro Plan',
    status: 'active',
    amount: '$49.00/mo',
    time: '2 minutes ago',
  },
  {
    customer: 'sarah@company.com',
    plan: 'Enterprise Plan',
    status: 'active',
    amount: '$199.00/mo',
    time: '1 hour ago',
  },
  {
    customer: 'emma@agency.com',
    plan: 'Starter Plan',
    status: 'active',
    amount: '$29.00/mo',
    time: '5 hours ago',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions'>('orders');

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-50 text-green-700 border-green-200',
      active: 'bg-green-50 text-green-700 border-green-200',
      processing: 'bg-blue-50 text-blue-700 border-blue-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
    };

    const icons: Record<string, React.ReactNode> = {
      completed: <CheckCircle2 size={14} />,
      active: <CheckCircle2 size={14} />,
      processing: <Clock size={14} className="animate-spin" />,
      pending: <Clock size={14} />,
      failed: <AlertCircle size={14} />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}
      >
        {icons[status] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const TrendIcon: React.FC<{ trend: 'up' | 'down' }> = ({ trend }) => {
    if (trend === 'up') {
      return <ArrowUpRight size={16} className="text-green-600" />;
    }
    return <ArrowDownRight size={16} className="text-red-600" />;
  };

  return (
    <div className="flex-1 bg-[#FAFAFA] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <Header
        title="Dashboard"
        breadcrumbs={[
          { label: 'Dashboard' },
        ]}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Welcome back, Jichun!</h2>
            <p className="text-neutral-300">
              Here's what's happening with your business today.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map((metric, index) => (
              <Card key={index} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    <metric.icon size={20} />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendIcon trend={metric.trend} />
                    <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">{metric.label}</h3>
                <p className="text-2xl font-bold text-neutral-900">{metric.value}</p>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Layout size={20} />
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('/products/new')}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Create Product
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/orders')}
                className="flex items-center gap-2"
              >
                <ShoppingCart size={16} />
                Manage Orders
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/finance')}
                className="flex items-center gap-2"
              >
                <BarChart3 size={16} />
                View Reports
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Recent Activity
                </h3>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center gap-2 mb-4 bg-neutral-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'orders'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'subscriptions'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Subscriptions
                </button>
              </div>

              {/* Orders List */}
              {activeTab === 'orders' && (
                <div className="space-y-3">
                  {RECENT_ORDERS.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-neutral-500">{order.id}</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-neutral-900 truncate">
                            {order.product}
                          </span>
                          <span className="text-neutral-300" aria-hidden="true">
                            •
                          </span>
                          <span className="text-neutral-500 text-xs truncate">
                            {order.customer}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="font-semibold text-neutral-900">{order.amount}</p>
                        <p className="text-xs text-neutral-500">{order.time}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate('/orders')}
                    className="w-full text-center text-sm text-neutral-500 hover:text-neutral-900 py-2"
                  >
                    View all orders →
                  </button>
                </div>
              )}

              {/* Subscriptions List */}
              {activeTab === 'subscriptions' && (
                <div className="space-y-3">
                  {RECENT_SUBSCRIPTIONS.map((sub, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                      onClick={() => navigate('/subscription')}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={sub.status} />
                          <span className="font-medium text-neutral-900">
                            {sub.customer}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500">{sub.plan}</p>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="font-semibold text-neutral-900">{sub.amount}</p>
                        <p className="text-xs text-neutral-500">{sub.time}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate('/subscription')}
                    className="w-full text-center text-sm text-neutral-500 hover:text-neutral-900 py-2"
                  >
                    Manage subscriptions →
                  </button>
                </div>
              )}
            </Card>

            {/* Notifications / Alerts */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Bell size={20} />
                Alerts & Notifications
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <CheckCircle2 size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      New subscription active
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      john@example.com subscribed to Pro Plan
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <AlertCircle size={20} className="text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      Payment failed
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      Order ORD-2844 payment failed. Customer will be notified.
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <TrendingUp size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      Revenue milestone reached
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      You've reached $12,000 in monthly revenue!
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">5 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <Package size={20} className="text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      Product published
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      "Weekly Business Report" is now live
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Revenue Chart Placeholder */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900">Revenue Overview</h3>
              <select className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
            </div>
            <div className="h-64 bg-neutral-50 rounded-lg flex items-center justify-center border-2 border-dashed border-neutral-200">
              <div className="text-center text-neutral-500">
                <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Revenue chart coming soon</p>
                <p className="text-xs mt-1">Track your revenue trends over time</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
