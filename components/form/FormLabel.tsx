import React from 'react';

interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  children,
  required = false,
  className = '',
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-[#1A1A1A] mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-[#DC2626] ml-1">*</span>}
    </label>
  );
};
