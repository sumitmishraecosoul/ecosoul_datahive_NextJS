'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ECommerceLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="space-y-6 mt-5">
      {/* Main Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
