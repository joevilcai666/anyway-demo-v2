import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  ...props 
}) => {
  
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Rounded full based on design screenshot
  const shapeStyle = "rounded-full"; 

  const variants = {
    primary: "bg-brand-yellow hover:bg-brand-yellowHover text-black border border-transparent shadow-sm focus:ring-brand-yellow",
    secondary: "bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 shadow-sm focus:ring-neutral-200",
    ghost: "bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-transparent",
    danger: "bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 focus:ring-red-200",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2",
  };

  return (
    <button
      className={`${baseStyle} ${shapeStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
