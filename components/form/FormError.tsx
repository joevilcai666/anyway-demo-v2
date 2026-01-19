import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  children: React.ReactNode;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  children,
  className = '',
}) => {
  if (!children) return null;

  return (
    <p className={`text-[13px] text-[#DC2626] mt-2 flex items-center gap-1 ${className}`}>
      <AlertCircle size={14} />
      {children}
    </p>
  );
};
