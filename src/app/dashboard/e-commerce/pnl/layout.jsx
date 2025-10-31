'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TabSelector from '../../../../Components/TabSelector';

export default function ECommercePnLLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = ['Transaction', 'Business'];
  const isBusiness = pathname?.endsWith('/business');
  const defaultActiveTab = isBusiness ? 1 : 0;

  const handleTabChange = (index) => {
    if (index === 0) {
      router.push('/dashboard/e-commerce/pnl');
    } else {
      router.push('/dashboard/e-commerce/pnl/business');
    }
  };

  return (
    <>
      <div>
        <h1 className='text-2xl font-bold text-black mb-5'>Choose a Report</h1>
      </div>
      <div>
        <TabSelector
          tabs={tabs}
          onTabChange={handleTabChange}
          defaultActiveTab={defaultActiveTab}
        />
      </div>
      <div className="space-y-6 mt-5">
        {children}
      </div>
    </>
  );
}