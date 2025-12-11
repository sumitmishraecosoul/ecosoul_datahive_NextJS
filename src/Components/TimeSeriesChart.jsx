import React from 'react';
import BaseChart from './BaseChart';

const TimeSeriesChart = ({
  data,
  title = 'Time Series',
  loading,
  yAxisLabel = 'Value',
}) => {
  const series = [
    {
      name: yAxisLabel,
      data: data.map((d) => ({ x: new Date(d.date).getTime(), y: d.value })),
    },
  ];

  const options = {
    chart: {
      type: 'area',
      zoom: {
        enabled: true,
      },
      animations: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    colors: ['#0ea5e9'],
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      title: {
        text: yAxisLabel,
      },
      labels: {
        formatter: (value) => {
          if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
          return `$${value.toFixed(0)}`;
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
      y: {
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
  };

  return (
    <BaseChart
      options={options}
      series={series}
      type="area"
      title={title}
      loading={loading}
    />
  );
};

export default TimeSeriesChart;
