'use client';
import React from 'react';
import { FaDownload } from 'react-icons/fa';

const DownloadButton = ({ 
  onClick,
  disabled = false,
  className = '',
  children = 'Download File'
}) => {
  return (
    <button
      className={`
        px-5 py-3 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ease-in-out
        min-w-20 text-center whitespace-nowrap outline-none flex items-center justify-center gap-2
        bg-teal-500 text-white shadow-lg shadow-teal-500/30
        hover:bg-teal-600 hover:shadow-teal-600/40 hover:shadow-lg hover:-translate-y-0.5
        active:transform active:translate-y-0 active:bg-teal-700
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <FaDownload size={16} />
      {children}
    </button>
  );
};

export default DownloadButton;
