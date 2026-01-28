import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { Toast } from './components/Toast';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrdersPage from './pages/OrdersPage';
import FinancePage from './pages/FinancePage';
import DevelopersPage from './pages/DevelopersPage';
import SubscriptionPage from './pages/SubscriptionPage';
import EmailInputPage from './pages/EmailInputPage';
import InvitationCodePage from './pages/InvitationCodePage';
import SurveyPage from './pages/SurveyPage';
import { NotFoundPage } from './components/NotFoundPage';

// Toast container component
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

const AppRouter: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Onboarding Routes (without layout) */}
          <Route path="/email-input" element={<EmailInputPage />} />
          <Route path="/invitation-code" element={<InvitationCodePage />} />
          <Route path="/survey" element={<SurveyPage />} />

          {/* Main App Routes (with layout) */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<HomePage />} />

            {/* Products */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />

            {/* Orders */}
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrdersPage />} />

            {/* Finance */}
            <Route path="/finance" element={<FinancePage />} />

            {/* Developer / Settings */}
            <Route path="/developer" element={<DevelopersPage />} />
            <Route path="/settings" element={<DevelopersPage />} />

            {/* Subscription */}
            <Route path="/subscription" element={<SubscriptionPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage viewName="404" />} />
        </Routes>

        {/* Global Toast Container */}
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
};

export default AppRouter;
