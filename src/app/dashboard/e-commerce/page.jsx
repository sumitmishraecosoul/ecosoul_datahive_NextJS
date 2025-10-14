'use client';
import React, { useState } from 'react';
import FilterSelector from '../../../Components/FilterSelector';
import MetricCard from '../../../Components/MetricCard';
import MetricTable from '../../../Components/MetricTable';
import { FaShoppingCart, FaWarehouse, FaTruckMoving, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

export default function ECommercePage() {
  const [filters, setFilters] = useState({ sku: '', material: '', monthYear: '',location: '' });

  const handleFilterChange = (newFilters) => {
    const simple = {};
    Object.keys(newFilters || {}).forEach((key) => {
      const v = newFilters[key];
      simple[key] = typeof v === 'object' ? (v?.value || '') : (v || '');
    });
    setFilters(simple);
  };

  const handleClear = () => setFilters({ sku: '', material: '', monthYear: '',location: '' });

  const filterConfig = [
    { key: 'sku', label: 'SKU', placeholder: 'e.g. CRCBOZ10NL' },
    { key: 'material', label: 'Material', placeholder: 'e.g. Palm Leaf' },
    { key: 'monthYear', label: 'Month-Year', placeholder: 'e.g. January 2025' },
    { key: 'location', label: 'Location', placeholder: 'e.g. Noida' }
  ];

  return (
    <div className="space-y-6">
      <FilterSelector
        title="Filters"
        config={filterConfig}
        options={{}}
        onChange={handleFilterChange}
        onClear={handleClear}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <MetricCard title="Total Demand Unit" value={3675} icon={<FaShoppingCart className="text-yellow-500" />} />
        <MetricCard title="On Hand WH Qty" value={3742} icon={<FaWarehouse className="text-yellow-500" />} />
        <MetricCard title="MTD Sale Unit" value={206} icon={<FaChartLine className="text-yellow-500" />} />
        <MetricCard title="Total Incoming" value={2487} icon={<FaTruckMoving className="text-yellow-500" />} />
        <MetricCard title="Sale Lost Value" value={'52K'} icon={<FaMoneyBillWave className="text-yellow-500" />} />
      </div>

      {/* Data Table */}
      <MetricTable title="" rows={[]} columns={[]} />
    </div>
  );
}