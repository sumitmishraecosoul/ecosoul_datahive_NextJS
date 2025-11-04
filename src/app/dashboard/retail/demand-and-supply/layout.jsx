'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TabSelector from '../../../../Components/TabSelector';

export default function DemandAndSupplyLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (index, tabName) => {
    if (tabName === 'West') {
      router.push('/dashboard/retail/demand-and-supply');
    } else if (tabName === 'East') {
      router.push('/dashboard/retail/demand-and-supply/east');
    }
  };

  const getActiveTab = () => {
    if (pathname === '/dashboard/retail/demand-and-supply/east') return 1;
    return 0; // West tab (default)
  };

  return (
    <div className="space-y-6">
      {/* Page Tabs */}
      <TabSelector
        tabs={['West', 'East']}
        onTabChange={handleTabChange}
        defaultActiveTab={getActiveTab()}
      />
      
      {/* Main Content */}
      <div>
        {children}
      </div>
    </div>
  );
}

