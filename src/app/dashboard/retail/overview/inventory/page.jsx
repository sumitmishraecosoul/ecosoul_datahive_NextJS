'use client';
import React, { useState } from 'react';
import FilterSelector from '../../../../../Components/FilterSelector';
import MetricTable from '../../../../../Components/MetricTable';
import BarChart from '../../../../../Components/BarChart';

export default function InventoryPage() {
  const [filters, setFilters] = useState({ sku: '', location: '' });

  const filterConfig = [
    { key: 'sku', label: 'SKU', placeholder: 'All SKUs' },
    { key: 'location', label: 'Location', placeholder: 'All Locations' },
  ];

  const handleFilterChange = (newFilters) => {
    const simple = {};
    Object.keys(newFilters || {}).forEach((key) => {
      const v = newFilters[key];
      simple[key] = typeof v === 'object' ? (v?.value || '') : (v || '');
    });
    setFilters(simple);
  };

  const handleClear = () => setFilters({ sku: '', location: '' });

  // Placeholder chart data
  const chart1Categories = ['Q1', 'Q2', 'Q3', 'Q4'];
  const chart1Series = [
    { name: 'Inventory', data: [0, 0, 0, 0] }
  ];

  const chart2Categories = ['Location A', 'Location B', 'Location C', 'Location D'];
  const chart2Series = [
    { name: 'Stock', data: [0, 0, 0, 0] }
  ];

  // Placeholder table columns
  const tableColumns = [
    { label: 'SKU', renderCell: (item) => item.sku || '-' },
    { label: 'Location', renderCell: (item) => item.location || '-' },
    { label: 'Quantity', renderCell: (item) => item.quantity || '-' },
  ];

  const rows = [];
  const rows2 = [];

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

      {/* Two bar charts in the same row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title="Material by Qty on Hand"
          categories={chart1Categories}
          series={chart1Series}
          colors={["#6366F1", "#22C55E"]}
          height={320}
        />
        <BarChart
          title="Material by PO & SO"
          categories={chart2Categories}
          series={chart2Series}
          colors={["#F59E0B", "#EF4444"]}
          height={320}
        />
      </div>

      {/* Inventory Table */}
      <MetricTable title="Inventory at Risk" rows={rows} columns={tableColumns} showSearch={false} titleClassName="text-lg font-semibold text-black" />

      {/* Second table below */}
      <MetricTable title="Inventory Stock Status" rows={rows2} columns={tableColumns} showSearch={false} titleClassName="text-lg font-semibold text-black" />
    </div>
  );
}

