import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerContent?: React.ReactNode;
  subHeaderContent?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
}

const SlideOver: React.FC<SlideOverProps> = ({ isOpen, onClose, title, headerContent, subHeaderContent, children, width = 'max-w-xl' }) => {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
        <div 
          className={`
            pointer-events-auto w-screen ${width} transform transition duration-300 ease-in-out bg-white shadow-2xl flex flex-col
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* Header */}
          <div className="bg-white border-b border-neutral-100 flex-shrink-0">
            <div className="flex items-center justify-between px-6 py-4">
              {headerContent ? (
                <div className="flex-1 min-w-0 mr-4">
                  {headerContent}
                </div>
              ) : (
                <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
              )}
              <button 
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 p-2 rounded-full transition-colors focus:outline-none flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Sub Header (optional) */}
            {subHeaderContent && (
              <div className="w-full">
                {subHeaderContent}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideOver;
