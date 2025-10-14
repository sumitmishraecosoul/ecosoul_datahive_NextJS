'use client';
import React from 'react';
import FilterSelector from '../../../../Components/FilterSelector';
import MetricCard from '../../../../Components/MetricCard';
import MetricTable from '../../../../Components/MetricTable';
import { 
  FaBox, 
  FaWarehouse, 
  FaCheck, 
  FaTruck, 
  FaFileInvoice, 
  FaShoppingCart, 
  FaPlus, 
  FaMapMarkerAlt, 
  FaMinus 
} from 'react-icons/fa';

export default function QuickCommercePage() {
  // Filter configuration for the FilterSelector
  const filterConfig = [
    { key: 'sku', label: 'SKU', placeholder: 'e.g. CRCBOZ10NL' },
    { key: 'location', label: 'Location', placeholder: 'e.g. Bangalore' }
  ];

  // Metric cards data
  const metricCards = [
    { title: 'Total SKU Count', value: '-', icon: <FaBox className="text-blue-600" /> },
    { title: 'Box/Case', value: '-', icon: <FaBox className="text-blue-600" /> },
    { title: 'Warehouse Qty', value: '-', icon: <FaWarehouse className="text-blue-600" /> },
    { title: 'Delivered', value: '-', icon: <FaCheck className="text-green-600" /> },
    { title: 'In-Transit', value: '-', icon: <FaTruck className="text-orange-600" /> },
    { title: 'Invoiced_Qty', value: '-', icon: <FaFileInvoice className="text-red-600" /> },
    { title: 'Sellable(In Hand)', value: '-', icon: <FaShoppingCart className="text-red-600" /> },
    { title: 'MTQ', value: '-', icon: <FaBox className="text-blue-600" /> },
    { title: 'Active PO Qty', value: '-', icon: <FaPlus className="text-green-600" /> },
    { title: 'SLA Days', value: '-', icon: <FaMapMarkerAlt className="text-blue-600" /> },
    { title: 'Inward Qty', value: '-', icon: <FaWarehouse className="text-blue-600" /> },
    { title: 'Required Qty', value: '-', icon: <FaMinus className="text-red-600" /> },
    { title: 'Sellable after Required Qty', value: '-', icon: <FaShoppingCart className="text-red-600" /> }
  ];

  // Table columns configuration
  const tableColumns = [
    { label: 'SKU', renderCell: (item) => item.sku },
    { label: 'Box/Case', renderCell: (item) => item.boxCase },
    { label: 'Location', renderCell: (item) => item.location },
    { label: 'Warehouse Qty', renderCell: (item) => item.warehouseQty },
    { label: 'Delivered', renderCell: (item) => item.delivered },
    { label: 'In-Transit', renderCell: (item) => item.inTransit },
    { label: 'Invoiced_Qty', renderCell: (item) => item.invoicedQty },
    { label: 'Sellable(In Hand)', renderCell: (item) => item.sellableInHand },
    { label: 'MTQ', renderCell: (item) => item.mtq },
    { label: 'Active PO Qty', renderCell: (item) => item.activePOQty },
    { label: 'SLA Days', renderCell: (item) => item.slaDays },
    { label: 'Inward Qty', renderCell: (item) => item.inwardQty },
    { label: 'Required Qty', renderCell: (item) => item.requiredQty },
    { label: 'Sellable after Re...', renderCell: (item) => item.sellableAfterRequired },
    { label: 'Stock Status', renderCell: (item) => item.stockStatus }
  ];

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <FilterSelector 
        title="Filters"
        config={filterConfig}
        options={{}}
        onChange={() => {}}
        onClear={() => {}}
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {metricCards.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
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
