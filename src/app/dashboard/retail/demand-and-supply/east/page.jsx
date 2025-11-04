'use client';
import React, { useState } from 'react';
import FilterSelector from '../../../../../Components/FilterSelector';
import MetricTable from '../../../../../Components/MetricTable';

export default function DemandAndSupplyEastPage() {
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

  // Placeholder table columns
  const tableColumns = [
    { label: 'SKU', renderCell: (item) => item.sku || '-' },
    { label: 'Location', renderCell: (item) => item.location || '-' },
    { label: 'Demand', renderCell: (item) => item.demand || '-' },
    { label: 'Supply', renderCell: (item) => item.supply || '-' },
  ];

  const rows = [];

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

      {/* Demand and Supply Table - East */}
      <MetricTable title="Demand and Supply - East" rows={rows} columns={tableColumns} showSearch={false} />
    </div>
  );
}

