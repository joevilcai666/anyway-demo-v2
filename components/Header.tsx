import React from 'react';
import { Bell, HelpCircle, Layout as LayoutIcon } from 'lucide-react';
import { MOCK_USER } from '../constants';

interface HeaderProps {
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const Header: React.FC<HeaderProps> = ({ title, breadcrumbs }) => {
  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 flex-shrink-0">
      {/* Breadcrumbs & Title */}
      <div className="flex items-center gap-3 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="text-neutral-300 mx-2" aria-hidden="true">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-neutral-900 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        {title && !breadcrumbs && (
          <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Help */}
        <button
          type="button"
          aria-label="Get help"
          className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
        >
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="View notifications"
          className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors relative"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center text-xs font-bold text-neutral-900 border border-black/5">
            {MOCK_USER.initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-neutral-900 leading-tight">
              {MOCK_USER.name}
            </p>
            <p className="text-xs text-neutral-500 leading-tight">
              {MOCK_USER.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
