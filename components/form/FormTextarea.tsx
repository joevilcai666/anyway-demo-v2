import React from 'react';
import { FormLabel } from './FormLabel';
import { FormError } from './FormError';

interface FormTextareaProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  minLength?: number;
  maxLength?: number;
  showCharCounter: boolean;
  rows?: number;
  minHeight?: string;
  required?: boolean;
  onBlur?: () => void;
  className?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  autoFocus = false,
  minLength,
  maxLength,
  showCharCounter = false,
  rows = 5,
  minHeight = '120px',
  required = false,
  onBlur,
  className = '',
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Character counter color logic
  const getCounterColor = () => {
    if (!maxLength) return 'text-[#A0A0A0]';
    const percentage = value.length / maxLength;
    if (percentage >= 1) return 'text-[#DC2626]';
    if (percentage > 0.9) return 'text-[#F97316]';
    return 'text-[#A0A0A0]';
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <FormLabel htmlFor={textareaId} required={required}>
          {label}
        </FormLabel>
      )}

      <div className="relative">
        <textarea
          id={textareaId}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          minLength={minLength}
          maxLength={maxLength}
          rows={rows}
          className={`
            w-full px-4 py-3
            bg-white border rounded-lg
            text-[15px] text-[#1A1A1A] leading-relaxed
            placeholder:text-[#A0A0A0]
            transition-all duration-150
            ${error
              ? 'border-[#DC2626] bg-[#FEF2F2]'
              : 'border-[#E0E0E0] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FDE047]/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{ minHeight }}
        />

        {showCharCounter && maxLength && (
          <div className={`absolute bottom-2 right-2 text-xs ${getCounterColor()}`}>
            {value.length} / {maxLength}
          </div>
        )}
      </div>

      {error && <FormError>{error}</FormError>}
    </div>
  );
};
