'use client';
import React from 'react';
import FilterSelector from '../../../Components/FilterSelector';
import NestedMetricCard from '../../../Components/NestedMetricCard';
import MetricTable from '../../../Components/MetricTable';

export default function SupplyChainPage() {
  // Filter configuration for the FilterSelector
  const filterConfig = [
    { key: 'sku', label: 'SKU', placeholder: 'All SKUs' },
    { key: 'channel', label: 'Channel', placeholder: 'All Channels' }
  ];

  // Stock summary metrics
  const stockMetrics = [
    { title: 'Sellable Stock', value: '-', profitLoss: null, profitLossText: '', icon: null },
    { title: 'Reserved', value: '-', profitLoss: null, profitLossText: '', icon: null },
    { title: 'Inbound', value: '-', profitLoss: null, profitLossText: '', icon: null }
  ];

  // Table columns configuration
  const tableColumns = [
    { label: 'SKU', renderCell: (item) => item.sku },
    { label: 'Channel', renderCell: (item) => item.channel },
    { label: 'Material', renderCell: (item) => item.material },
    { label: 'Box / Case', renderCell: (item) => item.boxCase },
    { label: 'Amazon-USA', renderCell: (item) => item.amazonUSA },
    { label: 'Shipcube-E...', renderCell: (item) => item.shipcubeE },
    { label: 'Updike', renderCell: (item) => item.updike },
    { label: '3G', renderCell: (item) => item.threeG },
    { label: 'Walmart', renderCell: (item) => item.walmart },
    { label: 'Shipcube-...', renderCell: (item) => item.shipcube },
    { label: 'Easy Ecom', renderCell: (item) => item.easyEcom },
    { label: 'Flipkart', renderCell: (item) => item.flipkart },
    { label: 'AWD-Units', renderCell: (item) => item.awdUnits },
    { label: 'Shipcube-E...', renderCell: (item) => item.shipcubeE2 },
    { label: 'Shipcube-...', renderCell: (item) => item.shipcubeE3 }
  ];

  return (
    <div className="space-y-6">
      {/* Inventory Filters */}
      <FilterSelector 
        title="Inventory Filters"
        config={filterConfig}
        options={{}}
        onChange={() => {}}
        onClear={() => {}}
      />

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stockMetrics.map((metric, index) => (
          <NestedMetricCard
            key={index}
            title={metric.title}
            metrics={[metric]}
            count={1}
            columns={1}
          />
        ))}
      </div>

      {/* SKU Search and Data Table */}
      <MetricTable 
        title=""
        rows={[]}
        columns={tableColumns}
      />
    </div>
  );
}
