'use client';
import React, { useState, useEffect } from 'react';
import FilterSelector from '../../../../Components/FilterSelector';
import MetricCard from '../../../../Components/MetricCard';
import MetricTable from '../../../../Components/MetricTable';
import DownloadButton from '../../../../Components/DownloadButton';
import { getQuickCommerceMetrics, getQuickCommerceData, getQuickCommerceDataDownload } from '../../../../api/supplychain';
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
  // Map metric titles coming from API to their corresponding icons
  const iconMap = {
    'Total SKU Count': <FaBox className="text-blue-600" />,
    'Box/Case': <FaBox className="text-blue-600" />,
    'Warehouse Qty': <FaWarehouse className="text-blue-600" />,
    'Delivered': <FaCheck className="text-green-600" />,
    'In-Transit': <FaTruck className="text-orange-600" />,
    'Invoiced_Qty': <FaFileInvoice className="text-red-600" />,
    'Sellable(In Hand)': <FaShoppingCart className="text-red-600" />,
    'MTQ': <FaBox className="text-blue-600" />,
    'Active PO Qty': <FaPlus className="text-green-600" />,
    'SLA Days': <FaMapMarkerAlt className="text-blue-600" />,
    'Inward Qty': <FaWarehouse className="text-blue-600" />,
    'Required Qty': <FaMinus className="text-red-600" />,
    'Sellable after Required Qty': <FaShoppingCart className="text-red-600" />,
  };
  const [filters, setFilters] = useState({ sku: '', location: '' });
  const [metrics, setMetrics] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter configuration for the FilterSelector
  const filterConfig = [
    { key: 'sku', label: 'SKU', placeholder: 'e.g. CRCBOZ10NL' },
    { key: 'location', label: 'Location', placeholder: 'e.g. Bangalore' }
  ];

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [filters]);

  // Initial data fetch on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching Quick Commerce data with filters:', filters);
      const [metricsResponse, dataResponse] = await Promise.all([
        getQuickCommerceMetrics(filters),
        getQuickCommerceData(filters)
      ]);
      console.log('Quick Commerce Metrics response:', metricsResponse);
      console.log('Quick Commerce Data response:', dataResponse);
      
      // Normalize metrics response into [{ title, value }]
      let processedMetrics = [];
      if (Array.isArray(metricsResponse)) {
        // Try common shapes inside array
        processedMetrics = metricsResponse.map((m, idx) => {
          if (m && typeof m === 'object') {
            const title = m.title || m.name || m.label || m.metric || `Metric ${idx+1}`;
            const value = m.value ?? m.count ?? m.qty ?? m.quantity ?? m.metric_value ?? '-';
            return { title, value };
          }
          return { title: `Metric ${idx+1}`, value: m };
        });
      } else if (metricsResponse && typeof metricsResponse === 'object') {
        // If it's an object, prefer nested arrays, else convert key/value map
        const nested = metricsResponse.data || metricsResponse.metrics;
        if (Array.isArray(nested)) {
          processedMetrics = nested.map((m, idx) => {
            if (m && typeof m === 'object') {
              const title = m.title || m.name || m.label || m.metric || `Metric ${idx+1}`;
              const value = m.value ?? m.count ?? m.qty ?? m.quantity ?? m.metric_value ?? '-';
              return { title, value };
            }
            return { title: `Metric ${idx+1}`, value: m };
          });
        } else {
          processedMetrics = Object.entries(metricsResponse).map(([k, v]) => ({ title: k, value: v }));
        }
      }
      
      // Process data response - API returns array of rows
      const processedData = Array.isArray(dataResponse) ? dataResponse : (dataResponse?.data || []);
      
      console.log('Processed Quick Commerce metrics:', processedMetrics);
      console.log('Processed Quick Commerce data:', processedData);
      
      setMetrics(processedMetrics);
      setTableData(processedData);
    } catch (error) {
      console.error('Error fetching Quick Commerce data:', error);
      setMetrics([]);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    // Extract simple string values from the filter objects
    const simpleFilters = {};
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] && typeof newFilters[key] === 'object') {
        simpleFilters[key] = newFilters[key].value || '';
      } else {
        simpleFilters[key] = newFilters[key] || '';
      }
    });
    setFilters(simpleFilters);
  };

  const handleDownload = async () => {
    try {
      const response = await getQuickCommerceDataDownload();
      // Handle file download
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sc-quick-commerce-data.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Default metric cards data (fallback when no API data)
  const defaultMetricCards = [
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

  // Use API data if available, otherwise use default cards
  const metricCards = metrics.length > 0 ? metrics : defaultMetricCards;

  // Table columns configuration - using flexible field mapping
  const tableColumns = [
    { label: 'SKU', renderCell: (item) => item['SKU'] || item.sku || '' },
    { label: 'Box/Case', renderCell: (item) => item['Box/Case'] || item.boxCase || '' },
    { label: 'Location', renderCell: (item) => item['Location'] || item.location || '' },
    { label: 'Warehouse Qty', renderCell: (item) => item['Warehouse Qty'] || item.warehouseQty || '' },
    { label: 'Delivered', renderCell: (item) => item['Delivered'] || item.delivered || '' },
    { label: 'In-Transit', renderCell: (item) => item['In-Transit'] || item.inTransit || '' },
    { label: 'Invoiced_Qty', renderCell: (item) => item['Invoiced_Qty'] || item.invoicedQty || '' },
    { label: 'Sellable(In Hand)', renderCell: (item) => item['Sellable(In Hand)'] || item.sellableInHand || '' },
    { label: 'MTQ', renderCell: (item) => item['MTQ'] || item.mtq || '' },
    { label: 'Active PO Qty', renderCell: (item) => item['Active PO Qty'] || item.activePOQty || '' },
    { label: 'SLA Days', renderCell: (item) => item['SLA Days'] || item.slaDays || '' },
    { label: 'Inward Qty', renderCell: (item) => item['Inward Qty'] || item.inwardQty || '' },
    { label: 'Required Qty', renderCell: (item) => item['Required Qty'] || item.requiredQty || '' },
    { label: 'Sellable after Re...', renderCell: (item) => item['Sellable after Required Qty'] || item.sellableAfterRequired || '' },
    { label: 'Stock Status', renderCell: (item) => item['Stock Status'] || item.stockStatus || '' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quick Commerce</h1>
        <DownloadButton 
          onClick={handleDownload}
          className="ml-4"
        >
          Download CSV
        </DownloadButton>
      </div>

      {/* Filters Section */}
      <FilterSelector 
        title="Filters"
        config={filterConfig}
        options={{}}
        onChange={handleFilterChange}
        onClear={() => setFilters({ sku: '', location: '' })}
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value || '-'}
            icon={metric.icon || iconMap[metric.title]}
          />
        ))}
      </div>

      {/* SKU Search and Data Table */}
      <div className="relative">
        <MetricTable 
          title=""
          rows={tableData}
          columns={tableColumns}
        />
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-gray-600">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
}
