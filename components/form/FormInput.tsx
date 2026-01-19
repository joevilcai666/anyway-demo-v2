import React from 'react';
import { FormLabel } from './FormLabel';
import { FormError } from './FormError';

interface FormInputProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'number';
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  showCharCounter?: boolean;
  required?: boolean;
  onBlur?: () => void;
  className?: string;
  // Height variants from DRD
  height?: 'sm' | 'md' | 'lg';
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter your text',
  type = 'text',
  error,
  disabled = false,
  autoFocus = false,
  maxLength,
  showCharCounter = false,
  required = false,
  onBlur,
  className = '',
  height = 'md',
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  // Height mapping
  const heightClasses = {
    sm: 'h-[40px]',
    md: 'h-[48px]',
    lg: 'h-[56px]',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <FormLabel htmlFor={inputId} required={required}>
          {label}
        </FormLabel>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={`
            w-full ${heightClasses[height]} px-4
            bg-white border rounded-lg
            text-[15px] text-[#1A1A1A]
            placeholder:text-[#A0A0A0]
            transition-all duration-150
            ${error
              ? 'border-[#DC2626] bg-[#FEF2F2]'
              : 'border-[#E0E0E0] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FDE047]/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />

        {showCharCounter && maxLength && (
          <div
            className={`
              absolute bottom-2 right-2 text-xs
              ${value.length > maxLength * 0.9
                ? 'text-[#F97316]'
                : value.length === maxLength
                ? 'text-[#DC2626]'
                : 'text-[#A0A0A0]'
              }
            `}
          >
            {value.length} / {maxLength}
          </div>
        )}
      </div>

      {error && <FormError>{error}</FormError>}
    </div>
  );
};
