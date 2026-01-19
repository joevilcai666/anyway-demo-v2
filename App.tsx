import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DevelopersPage from './pages/DevelopersPage';
import DashboardPage from './pages/DashboardPage';
import FinancePage from './pages/FinancePage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import EmailInputPage from './pages/EmailInputPage';
import InvitationCodePage from './pages/InvitationCodePage';
import SurveyPage from './pages/SurveyPage';
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
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] text-neutral-400 p-8">
            <div className="w-16 h-16 border-2 border-dashed border-neutral-300 rounded-2xl flex items-center justify-center mb-4">
               <span className="font-mono text-xl">404</span>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900">Prototype Placeholder</h2>
            <p className="mt-2 text-center max-w-md">
              The <strong>{currentView}</strong> page is not implemented in this prototype.
              Please navigate to <strong>Dashboard</strong>, <strong>Developers</strong>, or <strong>Finance</strong> to see the core requirements.
            </p>
          </div>
        );
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