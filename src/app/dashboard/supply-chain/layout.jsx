'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function SupplyChainLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="space-y-6 mt-4">
      <div>
        {children}
      </div>
    </div>
  );
}
