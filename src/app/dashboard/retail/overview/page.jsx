'use client';
import React, { useState } from 'react';
import FilterSelector from '../../../../Components/FilterSelector';
import MetricTable from '../../../../Components/MetricTable';

export default function RetailOverviewPage() {
  const [filters, setFilters] = useState({ sku: '', poNumber: '' });

  const filterConfig = [
    { key: 'sku', label: 'SKU', placeholder: 'All SKUs' },
    { key: 'poNumber', label: 'PO Number', placeholder: 'All POs' },
  ];

  const handleFilterChange = (newFilters) => {
    const simple = {};
    Object.keys(newFilters || {}).forEach((key) => {
      const v = newFilters[key];
      simple[key] = typeof v === 'object' ? (v?.value || '') : (v || '');
    });
    setFilters(simple);
  };

  const handleClear = () => setFilters({ sku: '', poNumber: '' });

  // Minimal two-column table definition (placeholder columns; hook up to data later)
  const twoCol = [
    { label: 'Field', renderCell: (item) => item.field || '-' },
    { label: 'Value', renderCell: (item) => item.value || '-' },
  ];

  // Placeholder rows for now; wiring to API can be added without affecting layout
  const rowsA = [];
  const rowsB = [];
  const rowsC = [];

  // Five column table config
  const fiveCol = [
    { label: 'Col 1', renderCell: (item) => item.c1 || '-' },
    { label: 'Col 2', renderCell: (item) => item.c2 || '-' },
    { label: 'Col 3', renderCell: (item) => item.c3 || '-' },
    { label: 'Col 4', renderCell: (item) => item.c4 || '-' },
    { label: 'Col 5', renderCell: (item) => item.c5 || '-' },
  ];
  const rowsFive = [];

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

      {/* Three tables; try to keep in one row when possible */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <MetricTable title="Invoice Total % Deduction by Category" rows={rowsA} columns={twoCol} showSearch={false} />
        <MetricTable title="Net Payable & Deduction by Category" rows={rowsB} columns={twoCol} showSearch={false} />
        <MetricTable title="Invoice Amount by Category" rows={rowsC} columns={twoCol} showSearch={false} />
      </div>

      {/* Five column table */}
      <MetricTable title="Retail Metrics" rows={rowsFive} columns={fiveCol} showSearch={false} />
    </div>
  );
}

