'use client';
import React, { useState, useEffect } from 'react';
import FilterSelector from '../../../../Components/FilterSelector';
import MetricCard from '../../../../Components/MetricCard';
import MetricTable from '../../../../Components/MetricTable';
import { Button } from '../../../../Components/Button';
import { getQuickCommerceMetrics, getQuickCommerceData, getQuickCommerceDataDownload, getQuickCommerceFilters } from '../../../../api/supplychain';
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
  const [skuOptions, setSkuOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter configuration for the FilterSelector
  const filterConfig = [
    { key: 'sku', label: 'SKU', placeholder: 'e.g. CRCBOZ10NL', options: skuOptions, searchable: true },
    { key: 'location', label: 'Location', placeholder: 'e.g. Bangalore', options: locationOptions, searchable: true }
  ];

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [filters]);

  // Initial data fetch on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getQuickCommerceFilters();
        const skuList = Array.isArray(data?.SKU) ? data.SKU : [];
        const locList = Array.isArray(data?.Location) ? data.Location : [];
        setSkuOptions(skuList.map((v) => ({ value: v, label: v })));
        setLocationOptions(locList.map((v) => ({ value: v, label: v })));
      } catch (e) {
        setSkuOptions([]);
        setLocationOptions([]);
      }
    };
    fetchFilters();
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

  // Table columns configuration with modern styling
  const tableColumns = [
    { 
      label: 'SKU', 
      renderCell: (item) => (
        <span className="font-medium text-blue-600">
          {item['SKU'] || item.sku || '-'}
        </span>
      )
    },
    { 
      label: 'Box/Case', 
      renderCell: (item) => (
        <span className="font-medium text-purple-600">
          {item['Box/Case'] || item.boxCase || '-'}
        </span>
      )
    },
    { 
      label: 'Location', 
      renderCell: (item) => (
        <span className="font-medium text-gray-700">
          {item['Location'] || item.location || '-'}
        </span>
      )
    },
    { 
      label: 'Warehouse Qty', 
      renderCell: (item) => {
        const value = item['Warehouse Qty'] || item.warehouseQty;
        return (
          <span className="font-medium text-indigo-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'Delivered', 
      renderCell: (item) => {
        const value = item['Delivered'] || item.delivered;
        return (
          <span className="font-medium text-green-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'In-Transit', 
      renderCell: (item) => {
        const value = item['In-Transit'] || item.inTransit;
        return (
          <span className="font-medium text-orange-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'Invoiced Qty', 
      renderCell: (item) => {
        const value = item['Invoiced_Qty'] || item.invoicedQty;
        return (
          <span className="font-medium text-red-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'Sellable(In Hand)', 
      renderCell: (item) => {
        const value = item['Sellable(In Hand)'] || item.sellableInHand;
        return (
          <span className="font-medium text-emerald-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'MTQ', 
      renderCell: (item) => {
        const value = item['MTQ'] || item.mtq;
        return (
          <span className="font-medium text-cyan-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'Active PO Qty', 
      renderCell: (item) => {
        const value = item['Active PO Qty'] || item.activePOQty;
        return (
          <span className="font-medium text-lime-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'SLA Days', 
      renderCell: (item) => {
        const value = item['SLA Days'] || item.slaDays;
        return (
          <span className="font-medium text-amber-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'Inward Qty', 
      renderCell: (item) => {
        const value = item['Inward Qty'] || item.inwardQty;
        return (
          <span className="font-medium text-teal-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'Required Qty', 
      renderCell: (item) => {
        const value = item['Required Qty'] || item.requiredQty;
        return (
          <span className="font-medium text-rose-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'Sellable after Re...', 
      renderCell: (item) => {
        const value = item['Sellable after Required Qty'] || item.sellableAfterRequired;
        return (
          <span className="font-medium text-violet-600">
            {value ? parseFloat(value).toLocaleString() : '-'}
          </span>
        );
      }
    },
    { 
      label: 'Stock Status', 
      renderCell: (item) => {
        const status = item['Stock Status'] || item.stockStatus;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'Surplus' || status === 'Available' || status === 'Good'
              ? 'bg-green-100 text-green-800' 
              : status === 'Low Stock' || status === 'Shortage' || status === 'Critical'
              ? 'bg-red-100 text-red-800'
              : status === 'Out of Stock' || status === 'Unavailable'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status || '-'}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quick Commerce</h1>
        <Button 
          onClick={handleDownload}
          className="ml-4"
          showDownloadIcon
        >
          Download CSV
        </Button>
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
