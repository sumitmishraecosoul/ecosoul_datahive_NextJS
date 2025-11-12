'use client';
import React, { useState } from 'react';
import FilterSelector from '../../../../../Components/FilterSelector';
import MetricCard from '../../../../../Components/MetricCard';
import MetricTable from '../../../../../Components/MetricTable';
import { FaShoppingCart, FaWarehouse, FaTruckMoving, FaMoneyBillWave, FaChartLine, FaBox, FaStore } from 'react-icons/fa';

export default function ChainStorePage() {
  const [filters, setFilters] = useState({ sku: '', store: '' });

  const filterConfig = [
    { key: 'sku', label: 'SKU', placeholder: 'All SKUs' },
    { key: 'store', label: 'Store', placeholder: 'All Stores' },
  ];

  const handleFilterChange = (newFilters) => {
    const simple = {};
    Object.keys(newFilters || {}).forEach((key) => {
      const v = newFilters[key];
      simple[key] = typeof v === 'object' ? (v?.value || '') : (v || '');
    });
    setFilters(simple);
  };

  const handleClear = () => setFilters({ sku: '', store: '' });

  // Seven metric cards (placeholder values; hook to API later)
  const metrics = [
    { title: 'Total Stores', value: '-', icon: <FaStore className="text-blue-600" /> },
    { title: 'Total Orders', value: '-', icon: <FaShoppingCart className="text-emerald-600" /> },
    { title: 'Delivered', value: '-', icon: <FaTruckMoving className="text-orange-600" /> },
    { title: 'Invoiced', value: '-', icon: <FaMoneyBillWave className="text-teal-600" /> },
    { title: 'On Hand Qty', value: '-', icon: <FaWarehouse className="text-indigo-600" /> },
    { title: 'MTD Sales', value: '-', icon: <FaChartLine className="text-purple-600" /> },
    { title: 'Open POs', value: '-', icon: <FaBox className="text-rose-600" /> },
  ];

  // Simple 2-column table columns
  const tableColumns = [
    { label: 'Field', renderCell: (item) => item.field || '-' },
    { label: 'Value', renderCell: (item) => item.value || '-' },
  ];

  // Define columns for 6, 7, and 10 column tables
  const sixCol = Array.from({ length: 6 }, (_, i) => ({
    label: `Col ${i + 1}`,
    renderCell: (item) => item[`c${i + 1}`] || '-',
  }));
  const sevenCol = Array.from({ length: 7 }, (_, i) => ({
    label: `Col ${i + 1}`,
    renderCell: (item) => item[`c${i + 1}`] || '-',
  }));
  const tenCol = Array.from({ length: 10 }, (_, i) => ({
    label: `Col ${i + 1}`,
    renderCell: (item) => item[`c${i + 1}`] || '-',
  }));

  // Placeholder rows (empty for now)
  const rows6 = [];
  const rows7 = [];
  const rows10 = [];

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

      {/* Seven metric cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <MetricCard key={idx} title={m.title} value={m.value} icon={m.icon} />
        ))}
      </div>

      {/* Two metric tables in one row (6 and 7 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricTable title="Retailer Vendor Cost Ordered by Shipped" rows={rows6} columns={sixCol} showSearch={false} titleClassName="text-lg font-semibold text-black" />
        <MetricTable title="Quantity Ordered vs Shipped" rows={rows7} columns={sevenCol} showSearch={false} titleClassName="text-lg font-semibold text-black" />
      </div>

      {/* One metric table with 10 columns below */}
      <MetricTable title="Chain Store Detailed View" rows={rows10} columns={tenCol} showSearch={false} titleClassName="text-lg font-semibold text-black" />
    </div>
  );
}

