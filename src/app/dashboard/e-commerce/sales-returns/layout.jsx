'use client';
import React from 'react';
import TabSelector from '../../../../Components/TabSelector';
import { useRouter } from 'next/navigation';

export default function SalesReturnsLayout({ children }) {
  const router = useRouter();
  const tabs = ['Sales', 'Returns'];
  const defaultActiveTab = 0;

  const handleTabChange = (index) => {
    if (index === 0) {
      router.push('/dashboard/e-commerce/sales-returns');
    } else {
      router.push('/dashboard/e-commerce/sales-returns/returns');
    }
  };
  return (
    <>
    <div>
      <h1 className='text-2xl font-bold text-black mb-5'>Sales & Returns</h1>
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