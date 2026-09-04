import React from 'react';

interface ProprintLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  className?: string;
}

export const ProprintLogo: React.FC<ProprintLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeConfigs = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <img
      src="/proprint-logo.png"
      alt="Proprint"
      className={`${sizeConfigs[size]} w-auto object-contain ${className}`}
    />
  );
};