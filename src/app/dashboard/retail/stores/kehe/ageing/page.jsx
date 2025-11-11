'use client';
import React, { useState } from 'react';
import FilterSelector from "../../../../../../Components/FilterSelector.jsx";
import NestedMetricCard from "../../../../../../Components/NestedMetricCard.jsx";
import MetricTable from "../../../../../../Components/MetricTable.jsx";

export default function KeheAgeingPage() {
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

  // Placeholder metrics for nested metric cards
  const metrics1 = [
    { title: 'Metric 1', value: '-' },
    { title: 'Metric 2', value: '-' },
    { title: 'Metric 3', value: '-' },
  ];

  const metrics2 = [
    { title: 'Metric A', value: '-' },
    { title: 'Metric B', value: '-' },
    { title: 'Metric C', value: '-' },
  ];

  // Define 10 column table columns
  const tenCol = Array.from({ length: 10 }, (_, i) => ({
    label: `Col ${i + 1}`,
    renderCell: (item) => item[`c${i + 1}`] || '-',
  }));

  // Placeholder rows (empty for now)
  const rows1 = [];
  const rows2 = [];
  const rows3 = [];

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

      {/* Two nested metric cards in the same row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NestedMetricCard title="Aged Inventory & Vendor Cose Below 91 days" metrics={metrics1} />
        <NestedMetricCard title="Aged Inventory & Vendor Cose Above 90 days" metrics={metrics2} />
      </div>

      {/* Three tables in separate rows, each with 10 columns */}
      <MetricTable title="Overview" rows={rows1} columns={tenCol} showSearch={false} />
      <MetricTable title="DC by Inventory Aged & Vendor Cost" rows={rows2} columns={tenCol} showSearch={false} />
      <MetricTable title="Inventory Aging by SKU across DC" rows={rows3} columns={tenCol} showSearch={false} />
    </div>
  );
}

