import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, width = 'max-w-md' }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Focus trap
      const previousActiveElement = document.activeElement as HTMLElement;
      const modalElement = modalRef.current;

      if (modalElement) {
        // Focus the first focusable element
        const focusableElements = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        }
      }

      return () => {
        window.removeEventListener('keydown', handleEsc);
        // Restore focus when modal closes
        if (previousActiveElement) {
          previousActiveElement.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Content */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative bg-white rounded-2xl shadow-xl w-full ${width} transform transition-all flex flex-col max-h-[90vh]`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <h3 id={titleId} className="text-lg font-semibold text-neutral-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
