import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { OnboardingUser } from '../../types';

interface OnboardingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (isOpen && overlayRef.current) {
      const focusableElements = overlayRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#FAFAFA] animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-sm p-10 animate-in fade-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#666666] hover:text-[#1A1A1A] transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Children */}
        <div id="onboarding-title">
          {children}
        </div>
      </div>
    </div>
  );
};
