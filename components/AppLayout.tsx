import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ViewState } from '../types';
import { Menu, X } from 'lucide-react';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Map current route to ViewState
  const currentView = (() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return ViewState.DASHBOARD;
    if (path.startsWith('/products')) return ViewState.PRODUCTS;
    if (path.startsWith('/orders')) return ViewState.ORDERS;
    if (path.startsWith('/finance')) return ViewState.FINANCE;
    if (path.startsWith('/developer')) return ViewState.DEVELOPERS;
    if (path.startsWith('/settings')) return ViewState.DEVELOPERS;
    if (path.startsWith('/subscription')) return ViewState.SUBSCRIPTION;
    return ViewState.DASHBOARD;
  })();

  // Check if should show sidebar (not for onboarding pages)
  const shouldShowSidebar = ![
    '/email-input',
    '/invitation-code',
    '/survey'
  ].includes(location.pathname);

  // Handle navigation
  const handleNavigate = (view: ViewState) => {
    switch (view) {
      case ViewState.DASHBOARD:
        navigate('/');
        break;
      case ViewState.PRODUCTS:
        navigate('/products');
        break;
      case ViewState.ORDERS:
        navigate('/orders');
        break;
      case ViewState.FINANCE:
        navigate('/finance');
        break;
      case ViewState.DEVELOPERS:
        navigate('/developer');
        break;
      case ViewState.SUBSCRIPTION:
        navigate('/subscription');
        break;
      case ViewState.EMAIL_INPUT:
        navigate('/email-input');
        break;
      case ViewState.INVITATION_CODE:
        navigate('/invitation-code');
        break;
      case ViewState.SURVEY:
        navigate('/survey');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-neutral-900 overflow-hidden">
      {/* Mobile Header */}
      {isMobile && shouldShowSidebar && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-40 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg">Anyway</span>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-xl overflow-hidden flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
            <span className="font-bold text-lg">Anyway</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <Sidebar
            currentView={currentView}
            onChangeView={(view) => {
              handleNavigate(view);
              setIsMobileMenuOpen(false);
            }}
            isCollapsed={false}
            toggleCollapse={() => {}}
          />
        </div>
      )}

      {/* Desktop Sidebar */}
      {shouldShowSidebar && !isMobile && (
        <Sidebar
          currentView={currentView}
          onChangeView={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-16 lg:pt-0">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AppLayout;
