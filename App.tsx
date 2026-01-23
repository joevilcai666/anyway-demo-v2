import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { NotFoundPage } from './components/NotFoundPage';
import DevelopersPage from './pages/DevelopersPage';
import DashboardPage from './pages/DashboardPage';
import FinancePage from './pages/FinancePage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import EmailInputPage from './pages/EmailInputPage';
import InvitationCodePage from './pages/InvitationCodePage';
import SurveyPage from './pages/SurveyPage';
import SubscriptionPage from './pages/SubscriptionPage';
import { Toast } from './components/Toast';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // Simple Router Switch
  const renderContent = () => {
    switch (currentView) {
      case ViewState.EMAIL_INPUT:
        return (
          <EmailInputPage
            onContinue={(email) => {
              setUserEmail(email);
              setCurrentView(ViewState.INVITATION_CODE);
            }}
          />
        );
      case ViewState.INVITATION_CODE:
        return (
          <InvitationCodePage
            email={userEmail}
            onNavigateToSurvey={() => setCurrentView(ViewState.SURVEY)}
            onNavigateToDashboard={() => setCurrentView(ViewState.DASHBOARD)}
            onNavigateToLogin={() => {/* TODO: Implement login page */}}
          />
        );
      case ViewState.SURVEY:
        return (
          <SurveyPage
            email={userEmail}
            onNavigateBack={() => setCurrentView(ViewState.INVITATION_CODE)}
          />
        );
      case ViewState.DASHBOARD:
        return <DashboardPage />;
      case ViewState.PRODUCTS:
        return <ProductsPage />;
      case ViewState.ORDERS:
        return <OrdersPage />;
      case ViewState.DEVELOPERS:
        return <DevelopersPage />;
      case ViewState.FINANCE:
        return <FinancePage />;
      case ViewState.SUBSCRIPTION:
        return <SubscriptionPage />;
      default:
        return <NotFoundPage viewName={currentView} />;
    }
  };

  // Check if should show sidebar (not for onboarding pages)
  const shouldShowSidebar = currentView !== ViewState.EMAIL_INPUT &&
                            currentView !== ViewState.INVITATION_CODE &&
                            currentView !== ViewState.SURVEY;

  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#FAFAFA] text-neutral-900 overflow-hidden">
        {shouldShowSidebar && (
          <Sidebar
            currentView={currentView}
            onChangeView={setCurrentView}
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {renderContent()}
        </main>

        {/* Global Toast Container */}
        <ToastContainer />
      </div>
    </ToastProvider>
  );
};

// Inner component to handle toast state within ToastProvider
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast() || { toasts: [], removeToast: () => {} };

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

export default App;