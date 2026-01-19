import React from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  className = '',
}) => {
  const typeConfig = {
    success: {
      bgColor: 'bg-[#16A34A]',
      icon: Check,
    },
    error: {
      bgColor: 'bg-[#DC2626]',
      icon: X,
    },
    warning: {
      bgColor: 'bg-[#F97316]',
      icon: AlertTriangle,
    },
    info: {
      bgColor: 'bg-[#2563EB]',
      icon: Info,
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bgColor} text-white
        px-4 py-3 rounded-lg shadow-lg
        flex items-center gap-3
        min-w-[300px] max-w-[560px]
        animate-in fade-in slide-in-from-top-4
        duration-200 ease-out
        ${className}
      `}
    >
      <Icon size={20} className="flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
