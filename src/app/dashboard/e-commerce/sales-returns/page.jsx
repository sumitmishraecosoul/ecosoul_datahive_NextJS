'use client';

import React, { useState } from 'react';
import FilterSelector from '../../../../Components/FilterSelector';
import { Button } from '../../../../Components/Button';
import MetricCard from '../../../../Components/MetricCard';
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaCouch,
  FaCity,
  FaChartPie,
  FaReceipt,
} from 'react-icons/fa';
import TimeSeriesChart from '../../../../Components/TimeSeriesChart';
import BarChart from '../../../../Components/BarChart';
import MetricTable from '../../../../Components/MetricTable';

export default function SalesReturnsPage() {
  // Local filter state (no API wiring yet – this just holds user selections)
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);

  // Filter configuration to match the sales-returns UX:
  // - Date range (From / To) as simple text inputs for now
  // - SKU / ASIN search
  // - Countries (multi-select)
  // - Platforms (multi-select)
  const filterConfig = [
    {
      key: 'fromDate',
      label: 'From Date',
      placeholder: 'dd/mm/yyyy',
      options: [],
    },
    {
      key: 'toDate',
      label: 'To Date',
      placeholder: 'dd/mm/yyyy',
      options: [],
    },
    {
      key: 'skuAsin',
      label: 'SKU / ASIN',
      placeholder: 'Search SKU or ASIN',
      options: [],
    },
    {
      key: 'countries',
      label: 'Countries',
      placeholder: 'Select Countries',
      options: [
        { value: 'US', label: 'US' },
        { value: 'CA', label: 'CA' },
      ],
      searchable: false,
    },
    {
      key: 'platforms',
      label: 'Platforms',
      placeholder: 'Select Platforms',
      options: [
        { value: 'amazon', label: 'Amazon' },
        { value: 'amazon-ca', label: 'Amazon.ca' },
      ],
      searchable: false,
    },
  ];

  const handleFilterChange = (newFilters) => {
    // Keep a simple, serializable representation of the current selections
    const simple = {};
    Object.keys(newFilters || {}).forEach((key) => {
      const v = newFilters[key];
      if (Array.isArray(v)) {
        simple[key] = v.map((item) =>
          typeof item === 'object' ? item.value : item
        );
      } else if (v && typeof v === 'object') {
        simple[key] = v.value ?? '';
      } else {
        simple[key] = v ?? '';
      }
    });
    setFilters(simple);
  };

  const handleClear = () => setFilters({});

  // Static metric cards for now – can be wired to backend later
  const overviewMetrics = [
    {
      title: 'Total Revenue',
      value: '$1,670.75',
      icon: <FaMoneyBillWave className="text-emerald-500" />,
    },
    {
      title: 'Units Sold',
      value: '16',
      icon: <FaShoppingCart className="text-blue-500" />,
    },
    {
      title: 'Top Category',
      value: 'Furniture',
      icon: <FaCouch className="text-purple-500" />,
    },
    {
      title: 'Top City',
      value: 'Toronto',
      icon: <FaCity className="text-indigo-500" />,
    },
    {
      title: 'Platform Share',
      value: 'Amazon 50.9%',
      icon: <FaChartPie className="text-orange-500" />,
    },
    {
      title: 'Average Order Value',
      value: '$278.46',
      icon: <FaReceipt className="text-pink-500" />,
    },
  ];

  // Mock revenue trend data (can be replaced with real API data later)
  const revenueTrends = [
    { date: '2024-11-01', value: 1250 },
    { date: '2024-11-02', value: 980 },
    { date: '2024-11-03', value: 1430 },
    { date: '2024-11-04', value: 1670 },
    { date: '2024-11-05', value: 1320 },
    { date: '2024-11-06', value: 1710 },
    { date: '2024-11-07', value: 1600 },
  ];

  // Mock data for Sales by Product Category chart
  const categorySalesData = {
    categories: ['Electronics', 'Home Essentials', 'Clothing'],
    series: [
      {
        name: 'Revenue',
        data: [900, 150, 0],
      },
    ],
  };

  // Mock data for Sales by Country chart
  const countrySalesData = {
    categories: ['US', 'CA'],
    series: [
      {
        name: 'Revenue',
        data: [950, 50],
      },
    ],
  };

  // Mock table data for sales/returns
  const tableData = [
    {
      id: '1',
      sku: 'SKU-001',
      product: 'Wireless Headphones',
      category: 'Electronics',
      country: 'US',
      platform: 'Amazon',
      revenue: 450.50,
      units: 3,
      date: '2024-11-05',
    },
    {
      id: '2',
      sku: 'SKU-002',
      product: 'Coffee Maker',
      category: 'Home Essentials',
      country: 'CA',
      platform: 'Amazon.ca',
      revenue: 89.99,
      units: 1,
      date: '2024-11-06',
    },
    {
      id: '3',
      sku: 'SKU-003',
      product: 'Desk Chair',
      category: 'Furniture',
      country: 'US',
      platform: 'Amazon',
      revenue: 299.99,
      units: 1,
      date: '2024-11-04',
    },
    {
      id: '4',
      sku: 'SKU-004',
      product: 'Table Lamp',
      category: 'Home Decor',
      country: 'US',
      platform: 'Amazon',
      revenue: 45.00,
      units: 2,
      date: '2024-11-07',
    },
    {
      id: '5',
      sku: 'SKU-005',
      product: 'Kitchen Knife Set',
      category: 'Kitchen',
      country: 'CA',
      platform: 'Amazon.ca',
      revenue: 125.50,
      units: 1,
      date: '2024-11-03',
    },
  ];

  // Table columns configuration
  const tableColumns = [
    {
      label: 'SKU',
      renderCell: (item) => (
        <span className="font-medium text-blue-600">{item.sku || '-'}</span>
      ),
    },
    {
      label: 'Product',
      renderCell: (item) => (
        <span className="text-gray-700">{item.product || '-'}</span>
      ),
    },
    {
      label: 'Category',
      renderCell: (item) => (
        <span className="text-gray-600">{item.category || '-'}</span>
      ),
    },
    {
      label: 'Country',
      renderCell: (item) => (
        <span className="text-gray-700">{item.country || '-'}</span>
      ),
    },
    {
      label: 'Platform',
      renderCell: (item) => (
        <span className="text-gray-700">{item.platform || '-'}</span>
      ),
    },
    {
      label: 'Revenue',
      renderCell: (item) => (
        <span className="font-medium text-green-600">
          ${item.revenue?.toFixed(2) || '0.00'}
        </span>
      ),
    },
    {
      label: 'Units',
      renderCell: (item) => (
        <span className="text-gray-700">{item.units || '-'}</span>
      ),
    },
    {
      label: 'Date',
      renderCell: (item) => (
        <span className="text-gray-600">{item.date || '-'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Filter Toggle Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sales Overview</h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowFilters((prev) => !prev)}
            className="bg-white text-teal-600 border border-teal-200 shadow-none hover:bg-teal-50 hover:shadow-sm px-4 py-2"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>

      {showFilters && (
        <FilterSelector
          title="Filters"
          config={filterConfig}
          options={{}}
          onChange={handleFilterChange}
          onClear={handleClear}
        />
      )}

<div className="bg-white rounded-xl shadow-md p-4 mb-8 border border-red-400 border-2">
    <h2 className="text-lg font-semibold text-black">Key Metrics</h2>
  </div>

      {/* Sales overview metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {overviewMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div>

    
<div className="bg-white rounded-xl shadow-md p-4 mb-8 border border-yellow-400 border-2">
    <h2 className="text-lg font-semibold text-black">Sales Analytics</h2>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {overviewMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold text-black mb-4">Revenue Trends</h2>
        <div className="-mx-2">
          <TimeSeriesChart data={revenueTrends} title="" />
        </div>
      </div>

      {/* Sales by Category and Country Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title="Sales by Product Category"
          categories={categorySalesData.categories}
          series={categorySalesData.series}
          colors={['#3b82f6']}
          height={320}
        />
        <BarChart
          title="Sales by Country"
          categories={countrySalesData.categories}
          series={countrySalesData.series}
          colors={['#3b82f6']}
          height={320}
        />
      </div>

      {/* Sales Data Table */}
      <MetricTable
        rows={tableData}
        columns={tableColumns}
        showSearch={true}
      />
    </div>
  );
}