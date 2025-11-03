'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ECommerceLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="space-y-6 mt-5">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-5">E-Commerce Overview</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
