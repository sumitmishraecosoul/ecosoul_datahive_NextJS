'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TabSelector from '../../../Components/TabSelector';

export default function RetailLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (index, tabName) => {
    if (tabName === 'Overview') {
      router.push('/dashboard/retail');
    } else if (tabName === 'Stores') {
      router.push('/dashboard/retail/stores');
     } else if (tabName === 'Demand & Supply') {
      router.push('/dashboard/retail/demand-supply');
    }
    else if (tabName === 'Walmart') {
      router.push('/dashboard/retail/walmart');
    }
  };

  // Determine which tab should be active based on current path
  const getActiveTab = () => {
    if (pathname === '/dashboard/retail/stores') {
      return 1; // Stores tab
    }
    if (pathname === '/dashboard/retail/demand-supply') {
      return 2; // Demand & Supply tab
    }
    if (pathname === '/dashboard/retail/walmart') {
      return 3; // Walmart tab
    } else if (pathname === '/dashboard/retail/walmart') {
      return 3; // Walmart tab
    }
    return 0; // Overview tab (default)
  };

  return (
    <div className="space-y-6 mt-5">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-5">Retail Overview</h1>
          
          {/* Tab Selector */}
          <TabSelector 
             tabs={['Overview', 'Stores','Demand & Supply','Walmart']}
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
