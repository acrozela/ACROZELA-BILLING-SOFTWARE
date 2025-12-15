import React from 'react';

export const Logo = ({ className = "h-8" }: { className?: string }) => (
  <svg 
    viewBox="0 0 400 80" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Acrozela Logo"
  >
    <text 
      x="10" 
      y="60" 
      fontFamily="sans-serif" 
      fontWeight="900" 
      fontSize="50" 
      fill="#2563eb" 
      letterSpacing="4"
    >
      ACROZELA
    </text>
    <circle cx="340" cy="55" r="5" fill="#2563eb" />
  </svg>
);