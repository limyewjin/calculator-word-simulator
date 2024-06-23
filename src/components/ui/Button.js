import React from 'react';

export const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white p-2 rounded ${className}`}
  >
    {children}
  </button>
);

