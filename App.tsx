import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DevelopersPage from './pages/DevelopersPage';
import DashboardPage from './pages/DashboardPage';
import FinancePage from './pages/FinancePage';
import ProductsPage from './pages/ProductsPage';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Simple Router Switch
  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardPage />;
      case ViewState.PRODUCTS:
        return <ProductsPage />;
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

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-neutral-900 overflow-hidden">
      <Sidebar 
        currentView={currentView}
        onChangeView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;