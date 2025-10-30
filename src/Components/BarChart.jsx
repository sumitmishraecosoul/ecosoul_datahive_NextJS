'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * Reusable BarChart component built on ApexCharts
 * - Flexible props for categories, series, colors, height, and formatting
 * - Sensible defaults for modern, clean visuals
 */
export default function BarChart({
  title = '',
  categories = [],
  series = [],
  height = 320,
  colors = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444'],
  dataLabels = false,
  roundedBars = true,
  yFormatter,
}) {
  const options = useMemo(() => ({
    chart: {
      type: 'bar',
      toolbar: { show: false },
      foreColor: '#4B5563',
    },
    colors,
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      padding: { left: 8, right: 12, top: 8, bottom: 8 },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '44%',
        borderRadius: roundedBars ? 6 : 0,
        borderRadiusApplication: 'end',
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: dataLabels,
      formatter: (val) => {
        const num = Number(val);
        if (!Number.isFinite(num)) return '';
        return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : `${Math.round(num)}`;
      },
      style: { colors: ['#6B7280'] },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        trim: true,
        rotate: 0,
        style: { colors: '#6B7280' },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => {
          if (typeof yFormatter === 'function') return yFormatter(val);
          const num = Number(val);
          if (!Number.isFinite(num)) return '';
          return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : `${Math.round(num)}`;
        },
      },
    },
    legend: {
      show: series && series.length > 1,
      fontSize: '12px',
      labels: { colors: '#4B5563' },
      itemMargin: { horizontal: 8 },
      markers: { radius: 6 },
    },
    tooltip: {
      theme: 'dark', // higher contrast for readability
      style: { fontSize: '14px', fontFamily: 'inherit' },
      marker: { show: true },
      y: {
        formatter: (val) => {
          const num = Number(val);
          if (!Number.isFinite(num)) return '';
          return num.toLocaleString();
        },
      },
    },
    states: {
      hover: { filter: { type: 'lighten', value: 0.04 } },
      active: { filter: { type: 'darken', value: 0.6 } },
    },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    fill: { opacity: 0.95 },
  }), [categories, colors, dataLabels, roundedBars, series, yFormatter]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      {title ? (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
      ) : null}
      <div className="-mx-2">
        <ReactApexChart options={options} series={series} type="bar" height={height} />
      </div>
    </div>
  );
}


