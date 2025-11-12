'use client';
import React, { useEffect, useMemo, useState } from 'react';
import FilterSelector from "../../../../../../Components/FilterSelector.jsx";
import MetricCard from "../../../../../../Components/MetricCard.jsx";
import MetricTable from "../../../../../../Components/MetricTable.jsx";
import { FaShoppingCart, FaWarehouse, FaTruckMoving, FaMoneyBillWave, FaChartLine, FaBox, FaStore } from 'react-icons/fa';
import { getKeheCSFilters, getKeheCSMetricCardData, getKeheCSRetailerVendorByShipped, getKeheCSQuantityOrdered } from '../../../../../../api/retail.js';
import { useToast } from "../../../../../../Components/toast/ToastContext.jsx";

export default function KeheChainStorePage() {
  const toast = useToast();

  // Filters selected (keys will match filterConfig keys)
  const [filters, setFilters] = useState({});
  // Dynamic filter options loaded from backend
  const [filterOptions, setFilterOptions] = useState({});
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Metric cards data
  const [metricValues, setMetricValues] = useState({
    orderedVendorCost: '-',
    shippedVendorCost: '-',
    fillRateQuantity: '-',
    markup: '-',
    retailerCount: '-',
    skuCount: '-',
  });
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  const filterConfig = [
    { key: 'Month_Year', label: 'Month-Year', placeholder: 'All Month-Years' },
    { key: 'Retailer', label: 'Retailer', placeholder: 'All Retailers' },
    { key: 'Retail_Area', label: 'Retailer Area', placeholder: 'All Retailer Areas' },
    { key: 'SKU', label: 'SKU', placeholder: 'All SKUs' },
    { key: 'UPC', label: 'UPC', placeholder: 'All UPCs' },
    { key: 'Material', label: 'Material', placeholder: 'Material' },

  ];

  // Map backend filter lists to {value,label} arrays keyed by filterConfig keys
  const configuredFilters = useMemo(() => {
    const toOptions = (arr) => Array.isArray(arr) ? arr.map((v) => ({ value: String(v), label: String(v) })) : [];
    return filterConfig.map((f) => ({
      ...f,
      options: toOptions(filterOptions?.[f.key]),
      searchable: true,
    }));
  }, [filterOptions]);

  const handleFilterChange = (newFilters) => {
    const simple = {};
    Object.keys(newFilters || {}).forEach((key) => {
      const v = newFilters[key];
      simple[key] = typeof v === 'object' ? (v?.value || '') : (v || '');
    });
    setFilters(simple);
  };

  const handleClear = () => setFilters({});

  // Load filters on mount
  useEffect(() => {
    let isMounted = true;
    const loadFilters = async () => {
      setLoadingFilters(true);
      try {
        const data = await getKeheCSFilters();
        // Expecting keys: Month_Year, Retailer, 'Retailer Area', SKU, UPC, Material
        if (isMounted) {
          setFilterOptions(data || {});
        }
      } catch (e) {
        toast.error('Failed to load filters');
      } finally {
        if (isMounted) setLoadingFilters(false);
      }
    };
    loadFilters();
    return () => { isMounted = false; };
  }, [toast]);

  // Load metric card data when filters change
  useEffect(() => {
    let isMounted = true;
    const loadMetrics = async () => {
      setLoadingMetrics(true);
      try {
        const data = await getKeheCSMetricCardData(filters || {});
        // Mock/expected response keys:
        // "Ordered (Vendor Cost)", "Shipped (Vendor Cost)",
        // "Fill Rate (Quantity)", "Markup", "Retailer", "SKU"
        const ordered = data?.['Ordered (Vendor Cost)'];
        const shipped = data?.['Shipped (Vendor Cost)'];
        const fillRate = data?.['Fill Rate (Quantity)'];
        const markup = data?.['Markup'];
        const retailer = data?.['Retailer'];
        const sku = data?.['SKU'];

        const formatNumber = (val) => {
          if (val === null || val === undefined || val === '') return '-';
          const num = Number(val);
          if (Number.isNaN(num)) return String(val);
          return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
        };
        const formatPercent = (val) => {
          if (val === null || val === undefined || val === '') return '-';
          const num = Number(val);
          if (Number.isNaN(num)) return String(val);
          return `${num.toFixed(2)}%`;
        };

        if (isMounted) {
          setMetricValues({
            orderedVendorCost: formatNumber(ordered),
            shippedVendorCost: formatNumber(shipped),
            fillRateQuantity: formatPercent(fillRate),
            markup: formatPercent(markup),
            retailerCount: formatNumber(retailer),
            skuCount: formatNumber(sku),
          });
        }
      } catch (e) {
        if (isMounted) {
          setMetricValues({
            orderedVendorCost: '-',
            shippedVendorCost: '-',
            fillRateQuantity: '-',
            markup: '-',
            retailerCount: '-',
            skuCount: '-',
          });
        }
        toast.error('Failed to load metric cards');
      } finally {
        if (isMounted) setLoadingMetrics(false);
      }
    };
    loadMetrics();
    return () => { isMounted = false; };
  }, [filters, toast]);

  // Load first table data (Retailer Vendor Cost Ordered by Shipped)
  useEffect(() => {
    let isMounted = true;
    const loadTable1 = async () => {
      setLoadingTable1(true);
      try {
        const data = await getKeheCSRetailerVendorByShipped(filters || {});
        // Transform data to match 6-column table structure
        let tableData = [];
        if (Array.isArray(data)) {
          tableData = data.map((item, idx) => {
            // Handle array of objects - map to c1, c2, c3, c4, c5, c6
            const keys = Object.keys(item);
            return {
              id: `row-${idx}`,
              c1: item[keys[0]] ?? item.c1 ?? '-',
              c2: item[keys[1]] ?? item.c2 ?? '-',
              c3: item[keys[2]] ?? item.c3 ?? '-',
              c4: item[keys[3]] ?? item.c4 ?? '-',
              c5: item[keys[4]] ?? item.c5 ?? '-',
              c6: item[keys[5]] ?? item.c6 ?? '-',
            };
          });
        } else if (data && typeof data === 'object') {
          // Handle single object or object with array property
          if (data.rows || data.data || data.items) {
            const items = data.rows || data.data || data.items;
            tableData = Array.isArray(items) ? items.map((item, idx) => {
              const keys = Object.keys(item);
              return {
                id: `row-${idx}`,
                c1: item[keys[0]] ?? item.c1 ?? '-',
                c2: item[keys[1]] ?? item.c2 ?? '-',
                c3: item[keys[2]] ?? item.c3 ?? '-',
                c4: item[keys[3]] ?? item.c4 ?? '-',
                c5: item[keys[4]] ?? item.c5 ?? '-',
                c6: item[keys[5]] ?? item.c6 ?? '-',
              };
            }) : [];
          } else {
            // Single object - convert to single row
            const keys = Object.keys(data);
            tableData = [{
              id: 'row-0',
              c1: data[keys[0]] ?? data.c1 ?? '-',
              c2: data[keys[1]] ?? data.c2 ?? '-',
              c3: data[keys[2]] ?? data.c3 ?? '-',
              c4: data[keys[3]] ?? data.c4 ?? '-',
              c5: data[keys[4]] ?? data.c5 ?? '-',
              c6: data[keys[5]] ?? data.c6 ?? '-',
            }];
          }
        }
        if (isMounted) {
          setRows6(tableData);
        }
      } catch (e) {
        console.error('Error fetching retailer vendor by shipped data:', e);
        if (isMounted) {
          setRows6([]);
        }
        toast.error('Failed to load retailer vendor data');
      } finally {
        if (isMounted) setLoadingTable1(false);
      }
    };
    loadTable1();
    return () => { isMounted = false; };
  }, [filters, toast]);

  // Load second table data (Quantity Ordered vs Shipped)
  useEffect(() => {
    let isMounted = true;
    const loadTable2 = async () => {
      setLoadingTable2(true);
      try {
        const data = await getKeheCSQuantityOrdered(filters || {});
        // Transform data to match 7-column table structure
        let tableData = [];
        if (Array.isArray(data)) {
          tableData = data.map((item, idx) => {
            // Handle array of objects - map to c1, c2, c3, c4, c5, c6, c7
            const keys = Object.keys(item);
            return {
              id: `row-${idx}`,
              c1: item[keys[0]] ?? item.c1 ?? '-',
              c2: item[keys[1]] ?? item.c2 ?? '-',
              c3: item[keys[2]] ?? item.c3 ?? '-',
              c4: item[keys[3]] ?? item.c4 ?? '-',
              c5: item[keys[4]] ?? item.c5 ?? '-',
              c6: item[keys[5]] ?? item.c6 ?? '-',
              c7: item[keys[6]] ?? item.c7 ?? '-',
            };
          });
        } else if (data && typeof data === 'object') {
          // Handle single object or object with array property
          if (data.rows || data.data || data.items) {
            const items = data.rows || data.data || data.items;
            tableData = Array.isArray(items) ? items.map((item, idx) => {
              const keys = Object.keys(item);
              return {
                id: `row-${idx}`,
                c1: item[keys[0]] ?? item.c1 ?? '-',
                c2: item[keys[1]] ?? item.c2 ?? '-',
                c3: item[keys[2]] ?? item.c3 ?? '-',
                c4: item[keys[3]] ?? item.c4 ?? '-',
                c5: item[keys[4]] ?? item.c5 ?? '-',
                c6: item[keys[5]] ?? item.c6 ?? '-',
                c7: item[keys[6]] ?? item.c7 ?? '-',
              };
            }) : [];
          } else {
            // Single object - convert to single row
            const keys = Object.keys(data);
            tableData = [{
              id: 'row-0',
              c1: data[keys[0]] ?? data.c1 ?? '-',
              c2: data[keys[1]] ?? data.c2 ?? '-',
              c3: data[keys[2]] ?? data.c3 ?? '-',
              c4: data[keys[3]] ?? data.c4 ?? '-',
              c5: data[keys[4]] ?? data.c5 ?? '-',
              c6: data[keys[5]] ?? data.c6 ?? '-',
              c7: data[keys[6]] ?? data.c7 ?? '-',
            }];
          }
        }
        if (isMounted) {
          setRows7(tableData);
        }
      } catch (e) {
        console.error('Error fetching quantity ordered data:', e);
        if (isMounted) {
          setRows7([]);
        }
        toast.error('Failed to load quantity ordered data');
      } finally {
        if (isMounted) setLoadingTable2(false);
      }
    };
    loadTable2();
    return () => { isMounted = false; };
  }, [filters, toast]);

  // Seven metric cards (placeholder values; hook to API later)
  const metrics = [
    { title: 'Ordered (Vendor Cost)', value: loadingMetrics ? '...' : metricValues.orderedVendorCost, icon: <FaStore className="text-red-600" /> },
    { title: 'Shipped (Vendor Cost)', value: loadingMetrics ? '...' : metricValues.shippedVendorCost, icon: <FaShoppingCart className="text-yellow-400" /> },
    { title: 'Fill Rate (Quantity)', value: loadingMetrics ? '...' : metricValues.fillRateQuantity, icon: <FaTruckMoving className="text-green-600" /> },
    { title: 'Markup', value: loadingMetrics ? '...' : metricValues.markup, icon: <FaMoneyBillWave className="text-blue-600" /> },
    { title: 'Retailer', value: loadingMetrics ? '...' : metricValues.retailerCount, icon: <FaWarehouse className="text-pink-600" /> },
    { title: 'SKU', value: loadingMetrics ? '...' : metricValues.skuCount, icon: <FaChartLine className="text-purple-600" /> },
  ];

  // Simple 2-column table columns
  const tableColumns = [
    { label: 'Field', renderCell: (item) => item.field || '-' },
    { label: 'Value', renderCell: (item) => item.value || '-' },
  ];

  // Define columns for 6, 7, and 10 column tables
  const sixCol = [
    { label: 'Retailer', renderCell: (item) => item.c1 || '-' },
    { label: 'Store', renderCell: (item) => item.c2 || '-' },
    { label: 'SKU', renderCell: (item) => item.c3 || '-' },
    { label: 'Ordered (Vendor Cost)', renderCell: (item) => item.c4 || '-' },
    { label: 'Shipped (Vendor Cost)', renderCell: (item) => item.c5 || '-' },
    { label: 'Difference', renderCell: (item) => item.c6 || '-' },
  ];
  const sevenCol = [
    { label: 'SKU', renderCell: (item) => item.c1 || '-' },
    { label: 'Retailer', renderCell: (item) => item.c2 || '-' },
    { label: 'Store', renderCell: (item) => item.c3 || '-' },
    { label: 'SKU Count', renderCell: (item) => item.c4 || '-' },
    { label: 'Ordered (Qty)', renderCell: (item) => item.c5 || '-' },
    { label: 'Shipped (Qty)', renderCell: (item) => item.c6 || '-' },
    { label: 'Diff in Qty', renderCell: (item) => item.c7 || '-' },
  ];
  const tenCol = Array.from({ length: 10 }, (_, i) => ({
    label: `Col ${i + 1}`,
    renderCell: (item) => item[`c${i + 1}`] || '-',
  }));

  // Table data state
  const [rows6, setRows6] = useState([]);
  const [rows7, setRows7] = useState([]);
  const [loadingTable1, setLoadingTable1] = useState(false);
  const [loadingTable2, setLoadingTable2] = useState(false);
  const rows10 = [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <FilterSelector
        title="Filters"
        config={configuredFilters}
        onChange={handleFilterChange}
        onClear={handleClear}
      />

      {/* Seven metric cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <MetricCard key={idx} title={m.title} value={m.value} icon={m.icon} />
        ))}
      </div>

      {/* Two metric tables in one row (6 and 7 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricTable title="Retailer Vendor Cost Ordered by Shipped" rows={rows6} columns={sixCol} showSearch={false} titleClassName="text-lg font-semibold text-black" />
        <MetricTable title="Quantity Ordered vs Shipped" rows={rows7} columns={sevenCol} showSearch={false} titleClassName="text-lg font-semibold text-black" />
      </div>

      {/* One metric table with 10 columns below */}
      <MetricTable title="Chain Store Detailed View" rows={rows10} columns={tenCol} showSearch={false} titleClassName="text-lg font-semibold text-black" />
    </div>
  );
}

