'use client';
import React from 'react';

export default function RetailStoresLayout({ children }) {
  return (
    <div className="space-y-6 mt-5">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-5">Retail Stores</h1>
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}


