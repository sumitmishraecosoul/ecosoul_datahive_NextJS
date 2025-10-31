'use client';
import React, { useState, useEffect } from 'react';
import FilterSelector from '../../../../../Components/FilterSelector';
import MetricCard from '../../../../../Components/MetricCard';
import MetricTable from '../../../../../Components/MetricTable';
import { FaChartLine, FaPercent, FaMoneyBillWave, FaWarehouse, FaBalanceScale } from 'react-icons/fa';
import { getPnlBusinessMetricData, getPnlBusinessTableData } from '../../../../../api/pnl';

export default function ECommercePnLPage() {
  const [filters, setFilters] = useState({ channel: '', monthYear: '' });
  const [bizMetrics, setBizMetrics] = useState({
    cm1: null,
    cm2: null,
    cm3: null,
    adSpend: null,
    storageFee: null,
    sellingFee: null,
  });
  const [tableRows, setTableRows] = useState(null);

  const handleFilterChange = (newFilters) => {
    const simple = {};
    Object.keys(newFilters || {}).forEach((key) => {
      const v = newFilters[key];
      simple[key] = typeof v === 'object' ? (v?.value || '') : (v || '');
    });
    setFilters(simple);
  };

  const handleClear = () => setFilters({ channel: '', monthYear: '' });

  const filterConfig = [
    { key: 'channel', label: 'Channel', placeholder: 'Amazon-US' },
    { key: 'monthYear', label: 'Month-Year', placeholder: 'YYYY-MM'}
  ];

  const handleTabChange = () => {};

  // Load business metrics and table whenever filters change
  useEffect(() => {
    const buildParams = () => {
      const params = {};
      if (filters?.channel) params.channel = filters.channel;
      if (filters?.monthYear) params.monthYear = filters.monthYear;
      return params;
    };
    const fetchBizMetrics = async () => {
      try {
        const data = await getPnlBusinessMetricData(buildParams());
        setBizMetrics({
          cm1: data?.cm1 ?? null,
          cm2: data?.cm2 ?? null,
          cm3: data?.cm3 ?? null,
          adSpend: data?.adSpend ?? null,
          storageFee: data?.storageFee ?? null,
          sellingFee: data?.sellingFee ?? null,
        });
      } catch (err) {
        // Fail silently to avoid UI disruption
      }
    };
    const fetchBizTable = async () => {
      try {
        const data = await getPnlBusinessTableData(buildParams());
        const normalizeMap = {
          'FBA Fees': 'FBA Fee',
          'Selling fees': 'Selling Fee',
          'Total Ad Spend': 'Ad Spend',
          'Final_CM3': 'CM3',
        };
        const normalized = Object.entries(data || {}).reduce((acc, [key, val]) => {
          const label = normalizeMap[key] || key;
          acc[label] = val;
          return acc;
        }, {});
        const rows = pnlOrder.map((label) => ({ metric: label, value: normalized[label] ?? '' }));
        setTableRows(rows);
      } catch (err) {
        // Fail silently
      }
    };
    fetchBizMetrics();
    fetchBizTable();
  }, [filters]);

  const formatPct = (value) =>
    value === null || value === undefined ? '-' : `${Number(value).toFixed(2)}%`;

  const formatCurrency = (value) =>
    value === null || value === undefined || value === ''
      ? '-'
      : Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Desired ordering for the MetricTable rows
  const pnlOrder = [
    'Revenue',
    'COGS',
    'CM1',
    'Deal Fee',
    'FBA Inv Placement Fee',
    'FBA Inventory Fee',
    'FBA Reimbursement',
    'Liquidations',
    'Storage Fee',
    'FBA Fee',
    'CM2',
    'Other Marketing Expenses',
    'Promotional Rebates',
    'Selling Fee',
    'Ad Spend',
    'Other Inventory Expenses',
    'CM3',
  ];

  const pnlColumns = [
    { label: 'Metric', renderCell: (item) => item.metric },
    { 
      label: 'Value', 
      renderCell: (item) => {
        const n = typeof item.rawValue === 'number' ? item.rawValue : Number(item.rawValue);
        const isNum = Number.isFinite(n);
        const color = !isNum ? 'text-gray-700' : n > 0 ? 'text-green-600' : n < 0 ? 'text-red-600' : 'text-gray-700';
        return <span className={`${color} font-medium`}>{item.displayValue ?? item.value ?? '-'}</span>;
      }
    },
  ];

  return (
    <>
    <div className="space-y-6 mt-5">
      {/* Filters */}
      <FilterSelector
        title="Filters"
        config={filterConfig}
        options={{}}
        onChange={handleFilterChange}
        onClear={handleClear}
      />

      {/* KPI + Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: KPI Cards in 2-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard title="CM1" value={formatPct(bizMetrics.cm1)} icon={<FaChartLine className="text-red-500" />} />
          <MetricCard title="CM2" value={formatPct(bizMetrics.cm2)} icon={<FaPercent className="text-yellow-400" />} />
          <MetricCard title="CM3" value={formatPct(bizMetrics.cm3)} icon={<FaPercent className="text-green-500" />} />
          <MetricCard title="Ad Spend" value={formatPct(bizMetrics.adSpend)} icon={<FaMoneyBillWave className="text-blue-500" />} />
          <MetricCard title="Storage Fee" value={formatPct(bizMetrics.storageFee)} icon={<FaWarehouse className="text-yellow-500" />} />
          <MetricCard title="Selling Fee" value={formatPct(bizMetrics.sellingFee)} icon={<FaBalanceScale className="text-green-500" />} />
        </div>

        {/* Right: Data Table */}
        <div>
          <MetricTable
            title=""
            rows={(tableRows || pnlOrder.map((label) => ({ metric: label, value: '' }))).map((r) => ({
              ...r,
              rawValue: typeof r.value === 'number' ? r.value : Number(r.value),
              displayValue: formatCurrency(r.value),
            }))}
            columns={pnlColumns}
            showSearch={false}
            scrollable={false}
          />
        </div>
      </div>
    </div>
    </>
  );
}


