'use client';
import React, { useState, useEffect } from 'react';
import FilterSelector from '../../../Components/FilterSelector';
import NestedMetricCard from '../../../Components/NestedMetricCard';
import MetricTable from '../../../Components/MetricTable';
import { Button } from '../../../Components/Button';
import { getSCOverviewMetrics, getSCOverviewData, getSCOverviewDataDownload, getSCOverviewFilters } from '../../../api/supplychain';

export default function SupplyChainPage() {
  const [filters, setFilters] = useState({ sku: '' });
  const [skuOptions, setSkuOptions] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter configuration for the FilterSelector
  const filterConfig = [
    { key: 'sku', label: 'SKU', placeholder: 'All SKUs', options: skuOptions, searchable: true }
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
        const data = await getSCOverviewFilters();
        const skuList = Array.isArray(data?.SKU) ? data.SKU : [];
        setSkuOptions(skuList.map((v) => ({ value: v, label: v })));
      } catch (e) {
        setSkuOptions([]);
      }
    };
    fetchFilters();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching data with filters:', filters);
      const [metricsResponse, dataResponse] = await Promise.all([
        getSCOverviewMetrics(filters),
        getSCOverviewData(filters)
      ]);
      console.log('Metrics response:', metricsResponse);
      console.log('Data response:', dataResponse);
      
      // Normalize metrics into [{ title, value, group? }] for NestedMetricCard
      let processedMetrics = [];
      if (metricsResponse) {
        if (metricsResponse && typeof metricsResponse === 'object' && (metricsResponse.groups || metricsResponse.metrics)) {
        const groups = metricsResponse.groups || {};
          const m = metricsResponse.metrics || {};
          const groupNames = Object.keys(groups || {});
          if (groupNames.length > 0) {
            groupNames.forEach((groupName) => {
          const groupItems = groups[groupName] || [];
              groupItems.forEach((item) => {
            processedMetrics.push({
              title: item,
                  value: m[item] ?? '-',
                  group: groupName,
                });
              });
            });
          } else {
            // No groups provided; render all metrics under a Default group
            processedMetrics = Object.entries(m).map(([key, val]) => ({
              title: key,
              value: val ?? '-',
              group: 'Default',
            }));
          }
        } else if (Array.isArray(metricsResponse)) {
          // Some endpoints return an array with a single object containing { groups, metrics }
          if (
            metricsResponse.length > 0 &&
            metricsResponse[0] &&
            typeof metricsResponse[0] === 'object' &&
            (metricsResponse[0].groups || metricsResponse[0].metrics)
          ) {
            const first = metricsResponse[0];
            const groups = first.groups || {};
            const m = first.metrics || {};
            const groupNames = Object.keys(groups || {});
            if (groupNames.length > 0) {
              groupNames.forEach((groupName) => {
                const groupItems = groups[groupName] || [];
                groupItems.forEach((item) => {
                  processedMetrics.push({
                    title: item,
                    value: m[item] ?? '-',
                    group: groupName,
            });
          });
        });
            } else {
              processedMetrics = Object.entries(m).map(([key, val]) => ({
                title: key,
                value: val ?? '-',
                group: 'Default',
              }));
            }
          } else {
            // Fallback: generic array of metrics
            processedMetrics = metricsResponse.map((entry, idx) => {
              if (entry && typeof entry === 'object') {
                const title = entry.title || entry.name || entry.label || entry.metric || `Metric ${idx + 1}`;
                const value = entry.value ?? entry.count ?? entry.qty ?? entry.quantity ?? entry.metric_value ?? '-';
                const group = entry.group || entry.category || undefined;
                return { title, value, group };
              }
              return { title: `Metric ${idx + 1}`, value: entry ?? '-' };
            });
          }
        } else if (typeof metricsResponse === 'object') {
          const nested = metricsResponse.data || metricsResponse.metrics;
          if (Array.isArray(nested)) {
            processedMetrics = nested.map((entry, idx) => {
              if (entry && typeof entry === 'object') {
                const title = entry.title || entry.name || entry.label || entry.metric || `Metric ${idx + 1}`;
                const value = entry.value ?? entry.count ?? entry.qty ?? entry.quantity ?? entry.metric_value ?? '-';
                const group = entry.group || entry.category || undefined;
                return { title, value, group };
              }
              return { title: `Metric ${idx + 1}`, value: entry ?? '-' };
            });
          } else {
            processedMetrics = Object.entries(metricsResponse).map(([k, v]) => ({ title: k, value: v ?? '-' }));
          }
        }
      }
      
      // Process data response - API returns array of rows
      const processedData = Array.isArray(dataResponse) ? dataResponse : (dataResponse?.data || []);
      
      console.log('Processed metrics:', processedMetrics);
      console.log('Processed data:', processedData);
      
      setMetrics(processedMetrics);
      setTableData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      const response = await getSCOverviewDataDownload();
      // Handle file download
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sc-overview-data.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Table columns configuration - using the same structure as reference code
  const tableColumns = [
    { label: 'SKU', renderCell: (item) => item['SKU'] || item.sku || '' },
    { label: 'Channel', renderCell: (item) => item['Channel'] || item.channel || '' },
    { label: 'Material', renderCell: (item) => item['Material'] || item.material || '' },
    { label: 'Box / Case', renderCell: (item) => item['Box / Case'] || item.boxCase || '' },
    { label: 'Amazon-USA', renderCell: (item) => item['Amazon-USA'] || item.amazonUSA || '' },
    { label: 'Shipcube-East', renderCell: (item) => item['Shipcube-East'] || item.shipcubeE || '' },
    { label: 'Updike', renderCell: (item) => item['Updike'] || item.updike || '' },
    { label: '3G', renderCell: (item) => item['3G'] || item.threeG || '' },
    { label: 'Walmart', renderCell: (item) => item['Walmart'] || item.walmart || '' },
    { label: 'Shipcube-West', renderCell: (item) => item['Shipcube-West'] || item.shipcube || '' },
    { label: 'Easy Ecom', renderCell: (item) => item['Easy Ecom'] || item.easyEcom || '' },
    { label: 'Flipkart', renderCell: (item) => item['Flipkart'] || item.flipkart || '' },
    { label: 'AWD-Units', renderCell: (item) => item['AWD-Units'] || item.awdUnits || '' },
    { label: 'Shipcube-East_Instransit', renderCell: (item) => item['Shipcube-East_Instransit'] || item.shipcubeE2 || '' },
    { label: 'Shipcube-West_Intransit', renderCell: (item) => item['Shipcube-West_Intransit'] || item.shipcubeE3 || '' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Supply Chain Overview</h1>
        <Button 
          onClick={handleDownload}
          className="ml-4"
          showDownloadIcon
        >
          Download CSV
        </Button>
      </div>

      {/* Inventory Filters */}
      <FilterSelector 
        title="Inventory Filters"
        config={filterConfig}
        options={{}}
        onChange={handleFilterChange}
        onClear={() => setFilters({ sku: '' })}
      />

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.length > 0 ? (
          // Group metrics by their group name and render as separate cards
          Object.entries(
            metrics.reduce((acc, metric) => {
              const group = metric.group || 'Default';
              if (!acc[group]) acc[group] = [];
              acc[group].push(metric);
              return acc;
            }, {})
          ).map(([groupName, groupMetrics], index) => {
            // Choose sensible columns per group size (no UI structure change)
            const columns =
              groupName === 'Sellable Stock'
                ? 3
                : groupMetrics.length >= 12
                ? 4
                : 1;

            return (
              <NestedMetricCard
                className="grid-cols-1 md:grid-cols-3 gap-6"
                key={index}
                title={groupName}
                metrics={groupMetrics.map(metric => ({
                  title: metric.title,
                  value: metric.value || '-',
                  profitLoss: metric.profitLoss,
                  profitLossText: metric.profitLossText || '',
                  icon: metric.icon || null
                }))}
                count={groupMetrics.length}
                columns={columns}
              />
            );
          })
        ) : (
          // Default placeholder cards when no data
          [
            { title: 'Sellable Stock', value: '-', profitLoss: null, profitLossText: '', icon: null },
            { title: 'Reserved', value: '-', profitLoss: null, profitLossText: '', icon: null },
            { title: 'Inbound', value: '-', profitLoss: null, profitLossText: '', icon: null }
          ].map((metric, index) => (
            <NestedMetricCard
              key={index}
              title={metric.title}
              metrics={[metric]}
              count={1}
              columns={1}
            />
          ))
        )}
      </div>

      {/* SKU Search and Data Table */}
      <div className="relative">
        <MetricTable 
          title=""
          rows={tableData}
          columns={tableColumns}
          showSearch={false}
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
