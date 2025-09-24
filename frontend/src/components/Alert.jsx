import React from 'react';

export default function Alert({ children, variant = 'info', className = '' }) {
  const variants = {
    info: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    danger: 'bg-red-50 text-red-700',
    warning: 'bg-yellow-50 text-yellow-800',
  };
  return <div className={`rounded-md p-3 text-sm ${variants[variant]} ${className}`}>{children}</div>;
}


