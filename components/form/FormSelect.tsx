import React from 'react';
import { FormLabel } from './FormLabel';
import { FormError } from './FormError';

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  onBlur,
  className = '',
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <FormLabel htmlFor={selectId} required={required}>
          {label}
        </FormLabel>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            w-full h-[48px] px-4 pr-10
            bg-white border rounded-lg
            text-[15px] text-[#1A1A1A]
            transition-all duration-150
            appearance-none
            cursor-pointer
            ${error
              ? 'border-[#DC2626] bg-[#FEF2F2]'
              : 'border-[#E0E0E0] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FDE047]/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron down icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-[#666666]"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {error && <FormError>{error}</FormError>}
    </div>
  );
};
