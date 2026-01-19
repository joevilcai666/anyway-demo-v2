import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  className?: string;
  color?: 'white' | 'black' | 'yellow';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 20,
  className = '',
  color = 'white',
}) => {
  const colorClasses = {
    white: 'text-white',
    black: 'text-[#1A1A1A]',
    yellow: 'text-[#FDE047]',
  };

  return (
    <Loader2
      size={size}
      className={`animate-spin ${colorClasses[color]} ${className}`}
    />
  );
};
