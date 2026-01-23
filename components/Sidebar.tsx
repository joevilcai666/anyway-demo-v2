import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  PieChart,
  FileText,
  LogOut,
  Code2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CreditCard
} from 'lucide-react';
import { ViewState } from '../types';
import { MOCK_USER } from '../constants';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onChangeView,
  isCollapsed,
  toggleCollapse,
}) => {
  const [isAccountPanelOpen, setIsAccountPanelOpen] = useState(false);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const accountPanelRef = useRef<HTMLDivElement>(null);

  // Close account panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountPanelRef.current && 
        !accountPanelRef.current.contains(event.target as Node) &&
        !accountButtonRef.current?.contains(event.target as Node)
      ) {
        setIsAccountPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.PRODUCTS, label: 'Products', icon: Box },
    { id: ViewState.ORDERS, label: 'Orders', icon: ShoppingCart },
    { id: ViewState.FINANCE, label: 'Finance', icon: PieChart },
  ];

  const handleNavClick = (view: ViewState) => {
    onChangeView(view);
  };

  return (
    <aside 
      className={`
        relative z-20 flex flex-col bg-[#FAFAFA] border-r border-neutral-200 h-screen transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header / Brand */}
      <div className="h-16 flex items-center px-4 border-b border-transparent flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
            {/* Logo Icon Mockup */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20L10 4L20 20H4Z" fill="black"/>
            </svg>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight text-neutral-900 whitespace-nowrap">Anyway</span>
          )}
        </div>

        {/* Get Started Button (when not collapsed) */}
        {!isCollapsed && (
          <button
            onClick={() => onChangeView(ViewState.EMAIL_INPUT)}
            className="ml-auto px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-full transition-all duration-150 shadow-sm hover:shadow-md"
          >
            Get Started
          </button>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`
            ml-2 p-1 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors
            ${isCollapsed ? 'absolute left-1/2 -translate-x-1/2 top-16 mt-2' : ''}
          `}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 px-2 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                ${isActive 
                  ? 'bg-neutral-100 text-neutral-900' 
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-2 py-4 border-t border-transparent flex-shrink-0">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Documentation"
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <FileText size={20} />
          {!isCollapsed && <span>Documentation</span>}
        </a>
      </div>

      {/* User Footer (Anchor) */}
      <div className="p-2 border-t border-neutral-200 relative flex-shrink-0">
        <button
          ref={accountButtonRef}
          type="button"
          onClick={() => setIsAccountPanelOpen(!isAccountPanelOpen)}
          aria-expanded={isAccountPanelOpen}
          aria-haspopup="true"
          aria-label="Account options"
          className={`
            w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 group relative
            ${isCollapsed ? 'justify-center' : ''}
            ${isAccountPanelOpen ? 'bg-white shadow-sm' : ''}
          `}
        >
          <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center text-xs font-bold text-neutral-900 flex-shrink-0 border border-black/5">
            {MOCK_USER.initials}
          </div>
          {!isCollapsed && (
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-medium text-neutral-900 truncate leading-tight">{MOCK_USER.name}</p>
              <p className="text-[11px] text-neutral-500 truncate leading-tight">{MOCK_USER.email}</p>
            </div>
          )}
          {!isCollapsed && (
             <MoreVertical size={16} className="text-neutral-400 group-hover:text-neutral-600" aria-hidden="true" />
          )}
        </button>

        {/* Account Panel Popover */}
        {isAccountPanelOpen && (
          <div 
            ref={accountPanelRef}
            className={`
              absolute z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-neutral-200 overflow-hidden w-64
              left-full ml-2 bottom-0 mb-2
            `}
          >
            {/* Header info in panel */}
            <div className="p-3 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50/50">
               <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-sm font-bold text-neutral-900 flex-shrink-0 border border-black/5">
                {MOCK_USER.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{MOCK_USER.name}</p>
                <p className="text-xs text-neutral-500 truncate">{MOCK_USER.email}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => {
                  onChangeView(ViewState.DEVELOPERS);
                  setIsAccountPanelOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md transition-colors
                  ${currentView === ViewState.DEVELOPERS ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'}
                `}
              >
                <Code2 size={16} />
                <span>Developers</span>
              </button>

              <button
                onClick={() => {
                  onChangeView(ViewState.SUBSCRIPTION);
                  setIsAccountPanelOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md transition-colors
                  ${currentView === ViewState.SUBSCRIPTION ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'}
                `}
              >
                <CreditCard size={16} />
                <span>Subscription</span>
              </button>

              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                onClick={() => alert('Sign out clicked')}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;