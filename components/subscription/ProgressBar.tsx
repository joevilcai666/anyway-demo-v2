import React from 'react';

interface ProgressBarProps {
  percentage: number; // 0-100
  warningThreshold?: number; // Show warning color above this
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  warningThreshold = 80,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // Determine color based on threshold
  const getColor = () => {
    if (clampedPercentage >= 100) return 'bg-red-500';
    if (clampedPercentage >= warningThreshold) return 'bg-amber-500';
    return 'bg-brand-yellow';
  };

  // Determine height based on size
  const getHeight = () => {
    switch (size) {
      case 'sm': return 'h-1';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Background track */}
        <div className={`w-full ${getHeight()} bg-neutral-100 rounded-full overflow-hidden`}>

          {/* Fill bar */}
          <div
            className={`${getHeight()} ${getColor()} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${clampedPercentage}%` }}
            role="progressbar"
            aria-valuenow={clampedPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />

          {/* Label overlay (if showLabel is true) */}
          {showLabel && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-neutral-700 mix-blend-multiply">
                {Math.round(clampedPercentage)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
