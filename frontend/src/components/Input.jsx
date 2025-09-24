import React from 'react';

export default function Input({ className = '', ...props }) {
  return <input className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 ${className}`} {...props} />;
}


