'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TabSelector from '../../../Components/TabSelector';

export default function ECommerceLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (index, tabName) => {
    if (tabName === 'Overview') {
      router.push('/dashboard/e-commerce');
    } else if (tabName === 'PNL') {
      router.push('/dashboard/e-commerce/pnl');
    } else if (tabName === 'Inventory') {
      router.push('/dashboard/e-commerce/inventory');
    }
  };

  // Determine which tab should be active based on current path
  const getActiveTab = () => {
    if (pathname === '/dashboard/e-commerce/pnl') {
      return 1; // PNL tab
    }
    if (pathname === '/dashboard/e-commerce/inventory') {
      return 2; // Inventory tab
    }
    return 0; // Overview tab (default)
  };

  return (
    <div className="space-y-6 mt-5">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-5">E-Commerce Overview</h1>
          
          {/* Tab Selector */}
          <TabSelector 
            tabs={['Overview', 'PNL','Inventory']}
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
