'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TabSelector from '../../../../Components/TabSelector';

export default function RetailOverviewLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (index, tabName) => {
    if (tabName === 'Overview') {
      router.push('/dashboard/retail/overview');
    } else if (tabName === 'Chain Store') {
      router.push('/dashboard/retail/overview/chain-store');
    } 
    else if (tabName === 'Inventory') {
      router.push('/dashboard/retail/overview/inventory');
    }
    else if (tabName === 'Ageing') {
        router.push('/dashboard/retail/overview/ageing');
      }
  };

  const getActiveTab = () => {
    if (pathname === '/dashboard/retail/overview/chain-store') return 1;
    if (pathname === '/dashboard/retail/overview/inventory') return 2;
    if (pathname === '/dashboard/retail/overview/ageing') return 3;
    
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Page Tabs */}
      <TabSelector
        tabs={['Overview', 'Chain Store', 'Inventory','Ageing']}
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

