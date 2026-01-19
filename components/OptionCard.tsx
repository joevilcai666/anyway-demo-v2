import React from 'react';

interface OptionCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  title,
  description,
  selected,
  onClick,
  disabled = false,
  icon,
  className = '',
}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        w-full min-h-[64px] p-4
        bg-white border rounded-lg
        transition-all duration-150
        ${selected
          ? 'border-[#FDE047] bg-[#FEFCE8] shadow-md'
          : 'border-[#E0E0E0] hover:border-[#FDE047] hover:bg-[#FAFAFA]'
        }
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer'
        }
        ${className}
      `}
      role="radio"
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold text-[#1A1A1A]">
            {title}
          </h3>
          {description && (
            <p className="text-[13px] text-[#666666] mt-1">
              {description}
            </p>
          )}
        </div>
        {selected && (
          <div className="flex-shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-[#FDE047]"
            >
              <circle cx="10" cy="10" r="10" fill="currentColor" fillOpacity={0.2} />
              <circle cx="10" cy="10" r="5" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
