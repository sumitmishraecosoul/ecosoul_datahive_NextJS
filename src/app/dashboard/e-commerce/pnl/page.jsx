'use client';
import React, { useState } from 'react';
import FilterSelector from '../../../../Components/FilterSelector';
import MetricCard from '../../../../Components/MetricCard';
import MetricTable from '../../../../Components/MetricTable';
import { FaChartLine, FaPercent, FaMoneyBillWave, FaWarehouse, FaBalanceScale } from 'react-icons/fa';

export default function ECommercePnLPage() {
  const [filters, setFilters] = useState({ location: '', material: '', monthYear: '' });

  const handleFilterChange = (newFilters) => {
    const simple = {};
    Object.keys(newFilters || {}).forEach((key) => {
      const v = newFilters[key];
      simple[key] = typeof v === 'object' ? (v?.value || '') : (v || '');
    });
    setFilters(simple);
  };

  const handleClear = () => setFilters({ location: '', material: '', monthYear: '' });

  const filterConfig = [
    { key: 'location', label: 'Location', placeholder: 'e.g. Amazon-USA' },
    { key: 'material', label: 'Material', placeholder: 'e.g. Palm Leaf' },
    { key: 'monthYear', label: 'Month-Year', placeholder: 'e.g. January 2025' }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <FilterSelector
        title="Filters"
        config={filterConfig}
        options={{}}
        onChange={handleFilterChange}
        onClear={handleClear}
      />

      {/* KPI + Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 6 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard title="CM1%" value={'83%'} icon={<FaChartLine className="text-yellow-500" />} />
          <MetricCard title="CM2%" value={'45%'} icon={<FaPercent className="text-yellow-500" />} />
          <MetricCard title="CM3%" value={'0%'} icon={<FaPercent className="text-yellow-500" />} />
          <MetricCard title="Ad Spend %" value={'24%'} icon={<FaMoneyBillWave className="text-yellow-500" />} />
          <MetricCard title="Storage Fee %" value={'-2%'} icon={<FaWarehouse className="text-yellow-500" />} />
          <MetricCard title="Selling Fee %" value={'-15%'} icon={<FaBalanceScale className="text-yellow-500" />} />
        </div>

        {/* Right: Data Table */}
        <div className="bg-white rounded-xl shadow-md p-2">
          <MetricTable title="" rows={[]} columns={[]} />
        </div>
      </div>
    </div>
  );
}


