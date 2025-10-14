'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TabSelector from '../../../Components/TabSelector';

export default function SupplyChainLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (index, tabName) => {
    if (tabName === 'Overview') {
      router.push('/dashboard/supply-chain');
    } else if (tabName === 'Quick Commerce') {
      router.push('/dashboard/supply-chain/quick-commerce');
    }
  };

  // Determine which tab should be active based on current path
  const getActiveTab = () => {
    if (pathname === '/dashboard/supply-chain/quick-commerce') {
      return 1; // Quick Commerce tab
    }
    return 0; // Overview tab (default)
  };

  return (
    <div className="space-y-6 mt-5">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-5">Supply Chain Overview</h1>
          
          {/* Tab Selector */}
          <TabSelector 
            tabs={['Overview', 'Quick Commerce']}
            onTabChange={handleTabChange}
            defaultActiveTab={getActiveTab()}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
