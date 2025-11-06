'use client';
import React, { useState, useEffect } from 'react';
import FilterSelector from '../../../Components/FilterSelector';
import MetricCard from '../../../Components/MetricCard';
import MetricTable from '../../../Components/MetricTable';
import { Button } from '../../../Components/Button';
import { FaShoppingCart, FaWarehouse, FaTruckMoving, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { getEcommerceOverviewMetricCardData, getEcommerceOverviewDIByGeography, getEcommerceOverviewData, getEcommerceAlertCountByGeography, getEcommerceSKUTypeByGeography, getEcommerceSKUCountByGeography, getEcommerceOverviewFilters } from '../../../api/ecommerce';
import BarChart from '../../../Components/BarChart';
import DEV_URL from '../../../config/config';
import { useToast } from '../../../Components/toast';
import { Us, De, Gb, Ca } from 'react-flags-select';


export default function ECommercePage() {
  const toast = useToast();
  const [filters, setFilters] = useState({ sku: '', material: '', monthYear: '',country: '', alert: '', skuType: '', status: '' });
  const [metricData, setMetricData] = useState({
    Demand: 0,
    'afn-fulfillable-quantity': 0,
    'Sale Quantity': 0,
    'Total Incoming': 0,
    'Sale Lost': 0,
    AWD: 0,
    'AWD-Intransit': 0
  });
  const [geographyData, setGeographyData] = useState({
    CA: 0,
    DE: 0,
    UK: 0,
    US: 0
  });
  const [skuCountGeo, setSkuCountGeo] = useState({ CA: 0, DE: 0, UK: 0, US: 0 });
  const [loading, setLoading] = useState(true);
  const [geographyLoading, setGeographyLoading] = useState(true);
  const [skuCountLoading, setSkuCountLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geographyError, setGeographyError] = useState(null);
  const [skuCountError, setSkuCountError] = useState(null);
  const [tableError, setTableError] = useState(null);
  const [tableData, setTableData] = useState([]);
  // Alert Count by Geography chart state
  const [alertCategories, setAlertCategories] = useState(['US','UK','CA','DE']);
  const [alertSeries, setAlertSeries] = useState([
    { name: 'At Risk', data: [0,0,0,0] },
    { name: 'Critical', data: [0,0,0,0] },
    { name: 'Out Of Stock', data: [0,0,0,0] },
  ]);
  // SKU Type by Geography chart state
  const [skuCategories, setSkuCategories] = useState(['US','UK','CA','DE']);
  const [skuSeries, setSkuSeries] = useState([
    { name: 'Critical', data: [0,0,0,0] },
    { name: 'Non Critical', data: [0,0,0,0] },
  ]);
  
  // Filter options state
  const [skuOptions, setSkuOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [alertOptions, setAlertOptions] = useState([]);
  const [skuTypeOptions, setSkuTypeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [monthYearOptions, setMonthYearOptions] = useState([]);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getEcommerceOverviewFilters();
        const skuList = Array.isArray(data?.SKU) ? data.SKU : [];
        const materialList = Array.isArray(data?.Material) ? data.Material : [];
        const countryList = Array.isArray(data?.Country) ? data.Country : [];
        const alertList = Array.isArray(data?.Alert) ? data.Alert : [];
        const skuTypeList = Array.isArray(data?.SKU_Type) ? data.SKU_Type : [];
        const statusList = Array.isArray(data?.Status) ? data.Status : [];
        const monthYearList = Array.isArray(data?.Month_Year) ? data.Month_Year : [];
        
        setSkuOptions(skuList.map((v) => ({ value: v, label: v })));
        setMaterialOptions(materialList.map((v) => ({ value: v, label: v })));
        setCountryOptions(countryList.map((v) => ({ value: v, label: v })));
        setAlertOptions(alertList.map((v) => ({ value: v, label: v })));
        setSkuTypeOptions(skuTypeList.map((v) => ({ value: v, label: v })));
        setStatusOptions(statusList.map((v) => ({ value: v, label: v })));
        setMonthYearOptions(monthYearList.map((v) => ({ value: v, label: v })));
      } catch (e) {
        console.error('Error fetching filter options:', e);
      }
    };
    fetchFilters();
  }, []);

  const handleFilterChange = (newFilters) => {
    const simple = {};
    Object.keys(newFilters || {}).forEach((key) => {
      const v = newFilters[key];
      simple[key] = typeof v === 'object' ? (v?.value || '') : (v || '');
    });
    setFilters(simple);
  };

  const handleClear = () => setFilters({ sku: '', material: '', monthYear: '',country: '', alert: '', skuType: '', status: '' });

  // Fetch metric card data
  useEffect(() => {
    const fetchMetricData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEcommerceOverviewMetricCardData(filters);
        setMetricData(data);
      } catch (err) {
        setError('Failed to fetch metric data');
        console.error('Error fetching metric data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricData();
  }, [filters]);

  // Fetch SKU count by geography (cards)
  useEffect(() => {
    const fetchSkuCount = async () => {
      try {
        setSkuCountLoading(true);
        setSkuCountError(null);
        const data = await getEcommerceSKUCountByGeography(filters);
        if (data && typeof data === 'object') {
          const next = { CA: 0, DE: 0, UK: 0, US: 0 };
          ['CA','DE','UK','US'].forEach((k) => {
            const v = Number(data[k]);
            if (Number.isFinite(v)) next[k] = v;
          });
          setSkuCountGeo(next);
        } else {
          setSkuCountGeo({ CA: 0, DE: 0, UK: 0, US: 0 });
        }
      } catch (err) {
        setSkuCountError('Failed to fetch SKU count by geography');
        setSkuCountGeo({ CA: 0, DE: 0, UK: 0, US: 0 });
        console.error('Error fetching SKU count by geography:', err);
      } finally {
        setSkuCountLoading(false);
      }
    };
    fetchSkuCount();
  }, [filters]);

  // Fetch geography data
  useEffect(() => {
    const fetchGeographyData = async () => {
      try {
        setGeographyLoading(true);
        setGeographyError(null);
        const data = await getEcommerceOverviewDIByGeography(filters);
        // Normalize to { CA, DE, UK, US }
        let normalized = { CA: 0, DE: 0, UK: 0, US: 0 };
        if (Array.isArray(data)) {
          data.forEach((item) => {
            const code = item?.Country;
            const value = typeof item?.Instock_rate_base !== 'undefined' ? Number(item.Instock_rate_base) : undefined;
            if (code && Number.isFinite(value) && Object.prototype.hasOwnProperty.call(normalized, code)) {
              normalized[code] = value;
            }
          });
        } else if (data && typeof data === 'object') {
          // if backend returns a map like { CA: number, ... }
          ['CA','DE','UK','US'].forEach((code) => {
            const v = Number(data[code]);
            if (Number.isFinite(v)) normalized[code] = v;
          });
        }
        setGeographyData(normalized);
      } catch (err) {
        setGeographyError('Failed to fetch geography data');
        console.error('Error fetching geography data:', err);
      } finally {
        setGeographyLoading(false);
      }
    };

    fetchGeographyData();
  }, [filters]);

  // Fetch table data
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setTableLoading(true);
        setTableError(null);
        const data = await getEcommerceOverviewData(filters);
        setTableData(Array.isArray(data) ? data : []);
      } catch (err) {
        setTableError('Failed to fetch table data');
        console.error('Error fetching table data:', err);
        setTableData([]);
      } finally {
        setTableLoading(false);
      }
    };

    fetchTableData();
  }, [filters]);

  // Fetch Alert Count by Geography (chart 1)
  useEffect(() => {
    const fetchAlertChart = async () => {
      try {
        const resp = await getEcommerceAlertCountByGeography(filters);
        const geoOrder = ['US','UK','CA','DE'];
        const categories = geoOrder;
        const series = (resp?.series || []).map((s) => {
          const name = s?.Alert === 'Out of Stock' ? 'Out Of Stock' : (s?.Alert || '');
          const data = geoOrder.map((g) => Number(s?.data?.[g] ?? 0));
          return { name, data };
        });
        setAlertCategories(categories);
        setAlertSeries(series);
      } catch (e) {
        // Keep previous/zero state on failure
        console.error('Failed to fetch alert count by geography', e);
      }
    };
    fetchAlertChart();
  }, [filters]);

  // Fetch SKU Type by Geography (chart 2)
  useEffect(() => {
    const fetchSkuChart = async () => {
      try {
        const resp = await getEcommerceSKUTypeByGeography(filters);
        const geoOrder = ['US','UK','CA','DE'];
        const categories = geoOrder;
        const series = (resp?.series || []).map((s) => {
          const name = s?.Alert || '';
          const data = geoOrder.map((g) => Number(s?.data?.[g] ?? 0));
          return { name, data };
        });
        setSkuCategories(categories);
        setSkuSeries(series);
      } catch (e) {
        // Keep previous/zero state on failure
        console.error('Failed to fetch SKU type by geography', e);
      }
    };
    fetchSkuChart();
  }, [filters]);

  const filterConfig = [
    { key: 'sku', label: 'SKU', placeholder: 'Select SKU', options: skuOptions, searchable: true },
    { key: 'material', label: 'Material', placeholder: 'Select Material', options: materialOptions, searchable: true },
    { key: 'monthYear', label: 'Year-Month', placeholder: 'Select Month-Year', options: monthYearOptions, searchable: true },
    { key: 'country', label: 'Country', placeholder: 'Select Country', options: countryOptions, searchable: true },
    { key: 'alert', label: 'Alert', placeholder: 'Select Alert', options: alertOptions, searchable: true },
    { key: 'skuType', label: 'SKU Type', placeholder: 'Select SKU Type', options: skuTypeOptions, searchable: true },
    { key: 'status', label: 'Status', placeholder: 'Select Status', options: statusOptions, searchable: true }
  ];

  // Helper function to format values
  const formatValue = (value, type = 'number', isLoading = loading, hasError = error) => {
    if (isLoading) return '...';
    if (hasError) return 'Error';
    const num = typeof value === 'string' ? Number(value) : Number(value);
    if (!Number.isFinite(num)) return '-';
    
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    }
    
    if (type === 'compact') {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(num);
    }
    
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  // Helper to format generic numbers safely
  const formatNumber = (val) => {
    const num = Number(val);
    return Number.isFinite(num) ? num.toLocaleString() : '-';
  };

  // Custom columns configuration for the table based on API response
  const tableColumns = [
    {
      label: 'Country',
      renderCell: (item) => (
        <span className="font-medium text-gray-700">{item.Country || '-'}</span>
      )
    },
    {
      label: 'Year Month',
      renderCell: (item) => (
        <span className="text-gray-600">{item['Year Month'] || '-'}</span>
      )
    },
    {
      label: 'SKU',
      renderCell: (item) => (
        <span className="font-medium text-blue-600">{item.SKU || '-'}</span>
      )
    },
    {
      label: 'Status',
      renderCell: (item) => (
        <span className="text-gray-700">{item.Status || '-'}</span>
      )
    },
    {
      label: 'Demand',
      renderCell: (item) => (
        <span className="font-medium text-purple-600">{formatNumber(item.Demand)}</span>
      )
    },
    {
      label: 'Last 30 day sale qty',
      renderCell: (item) => (
        <span className="text-gray-600">{formatNumber(item['Last 30 day sale qty'])}</span>
      )
    },
    {
      label: 'MTD sale',
      renderCell: (item) => (
        <span className="text-gray-600">{formatNumber(item['MTD sale'])}</span>
      )
    },
    {
      label: 'Forecasted Sale',
      renderCell: (item) => (
        <span className="font-medium text-green-600">{formatNumber(item['Forecasted Sale'])}</span>
      )
    },
    {
      label: 'On hand Amazon WH',
      renderCell: (item) => (
        <span className="text-gray-600">{formatNumber(item['On hand Amazon WH'])}</span>
      )
    },
    {
      label: 'AWD',
      renderCell: (item) => (
        <span className="text-gray-600">{formatNumber(item.AWD)}</span>
      )
    },
    {
      label: 'AWD-Intransit',
      renderCell: (item) => (
        <span className="text-gray-600">{formatNumber(item['AWD-Intransit'])}</span>
      )
    },
    {
      label: 'Net Sellable',
      renderCell: (item) => (
        <span className="font-medium text-orange-600">{formatNumber(item['Net Sellable'])}</span>
      )
    },
    {
      label: 'Demand Fulfillable',
      renderCell: (item) => (
        <span className="text-gray-700">{formatNumber(item['Demand Fulfillable'])}</span>
      )
    },
    {
      label: 'Instock Rate',
      renderCell: (item) => (
        <span className="font-medium text-indigo-600">{item['Instock Rate'] ? `${parseFloat(item['Instock Rate']).toFixed(1)}%` : '-'}</span>
      )
    },
    {
      label: 'Alert',
      renderCell: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.Alert === 'At Risk' 
            ? 'bg-red-100 text-red-800' 
            : item.Alert === 'Safe' 
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.Alert || '-'}
        </span>
      )
    },
    {
      label: 'Incoming Date',
      renderCell: (item) => (
        <span className="text-gray-600">{item['Incoming Date'] || '-'}</span>
      )
    },
    {
      label: 'Total Incoming',
      renderCell: (item) => (
        <span className="font-medium text-blue-600">{formatNumber(item['Total Incoming'])}</span>
      )
    },
    {
      label: 'OB with Inbound',
      renderCell: (item) => (
        <span className="font-medium text-gray-700">{formatNumber(item['OB with Inbound'])}</span>
      )
    }
  ];

  const handleDownload = async () => {
    try {
      const response = await fetch(`${DEV_URL}/ecommerce/download/overview`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to download');

      const blob = await response.blob();

      // Try to infer filename from Content-Disposition
      const disposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
      let fileName = 'ecommerce-overview.csv';
      if (disposition) {
        const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^;"]+)"?/i);
        const extracted = match?.[1] || match?.[2];
        if (extracted) fileName = decodeURIComponent(extracted);
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success('Download completed');
    } catch (e) {
      console.error('Error downloading file:', e);
      toast.error('Download failed. Please try again.');
    }
  };

  return (
    <>
   

  <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">E-Commerce Overview</h1>
        <Button 
          onClick={handleDownload}
          className="ml-4"
          showDownloadIcon
        >
          Download CSV
        </Button>
      </div>

      <FilterSelector
        title="Filters"
        config={filterConfig}
        options={{}}
        onChange={handleFilterChange}
        onClear={handleClear}
      />
 <div className="bg-white rounded-xl shadow-md p-4 mb-8 border border-red-400 border-2">
    <h2 className="text-lg font-semibold text-black">Key Metrics</h2>
  </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard 
          title="Total Demand Unit" 
          value={formatValue(metricData.Demand)} 
          icon={<FaShoppingCart className="text-yellow-400" />} 
        />
        <MetricCard 
          title="On Hand WH Qty" 
          value={formatValue(metricData['afn-fulfillable-quantity'])} 
          icon={<FaWarehouse className="text-red-500" />} 
        />
        <MetricCard 
          title="MTD Sale Unit" 
          value={formatValue(metricData['Sale Quantity'])} 
          icon={<FaChartLine className="text-green-500" />} 
        />
        <MetricCard 
          title="Total Incoming" 
          value={formatValue(metricData['Total Incoming'])} 
          icon={<FaTruckMoving className="text-blue-500" />} 
        />
        <MetricCard 
          title="Sale Lost Value" 
          value={formatValue(metricData['Sale Lost'])} 
          icon={<FaMoneyBillWave className="text-pink-500" />} 
        />
        <MetricCard 
          title="AWD" 
          value={formatValue(metricData['AWD'])} 
          icon={<FaMoneyBillWave className="text-pink-500" />} 
        />
        <MetricCard 
          title="AWD-Intransit" 
          value={formatValue(metricData['AWD-Intransit'])} 
          icon={<FaMoneyBillWave className="text-pink-500" />} 
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-8 border border-yellow-400 border-2">
    <h2 className="text-lg font-semibold text-black">SKU Count by Geography</h2>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
    <MetricCard 
      title="United States (US)" 
      value={formatValue(skuCountGeo.US, 'number', skuCountLoading, skuCountError)} 
      icon={<Us className="w-10 h-10" />} 
    />
    <MetricCard 
      title="United Kingdom (UK)" 
      value={formatValue(skuCountGeo.UK, 'number', skuCountLoading, skuCountError)} 
      icon={<Gb className="w-10 h-10" />} 
    />
    <MetricCard 
      title="Canada (CA)" 
      value={formatValue(skuCountGeo.CA, 'number', skuCountLoading, skuCountError)} 
      icon={<Ca className="w-10 h-10" />} 
    />
    <MetricCard 
      title="Germany (DE)" 
      value={formatValue(skuCountGeo.DE, 'number', skuCountLoading, skuCountError)} 
      icon={<De className="w-10 h-10" />} 
    />
  </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-8 border border-green-400 border-2">
    <h2 className="text-lg font-semibold text-black">Demand Instock by Geography</h2>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
  <MetricCard 
      title="United States (US)" 
      value={`${formatValue(geographyData.US, 'number', geographyLoading, geographyError)}%`} 
      icon={<Us className="w-10 h-10" />} 
    />
    <MetricCard 
      title="United Kingdom (UK)" 
      value={`${formatValue(geographyData.UK, 'number', geographyLoading, geographyError)}%`} 
      icon={<Gb className="w-10 h-10" />} 
    />
    <MetricCard 
      title="Canada (CA)" 
      value={`${formatValue(geographyData.CA, 'number', geographyLoading, geographyError)}%`} 
      icon={<Ca className="w-10 h-10" />} 
    />
    <MetricCard 
      title="Germany (DE)" 
      value={`${formatValue(geographyData.DE, 'number', geographyLoading, geographyError)}%`} 
      icon={<De className="w-10 h-10" />} 
    />
  </div>

  {/* Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title="Alert Count by Geography"
          categories={alertCategories}
          series={alertSeries}
          colors={["#EF4444", "#FFD700", "#008000"]}
          height={320}
        />

        <BarChart
          title="SKU Type by Geography"
          categories={skuCategories}
          series={skuSeries}
          colors={["#EF4444", "#00BFFF"]}
          height={320}
        />
      </div>

    {/* <div className="space-y-6">
      <FilterSelector
        title="Filters"
        config={filterConfig}
        options={{}}
        onChange={handleFilterChange}
        onClear={handleClear}
      /> */}


       {/* KPI Cards */}
       

        {/* Data Table */}
        <MetricTable
          rows={tableData} 
          columns={tableColumns}
        />
    </div>
    </>
  );
}