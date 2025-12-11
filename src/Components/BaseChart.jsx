 'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR / window reference issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// BaseChart props (for reference only, not enforced at runtime)
// interface BaseChartProps {
//     options: ApexOptions;
//     series: ApexAxisChartSeries | ApexNonAxisChartSeries;
//     type: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'heatmap';
//     height?: number | string;
//     width?: string;
//     loading?: boolean;
//     title?: string;
// }
 
const BaseChart = ({
    options,
    series,
    type,
    height = 350,
    width = '100%',
    loading,
}) => {

    const chartOptions = useMemo(() => {
 
        return {
            ...options,
            theme: {
                mode: 'light',
            },
            chart: {
                ...options.chart,
                background: 'transparent',
                foreColor: '#374151',
                toolbar: {
                    show: true,
                    tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: true,
                        zoomout: true,
                        pan: false,
                        reset: false,
                    },
                },
            },
            grid: {
                ...options.grid,
                borderColor: '#e5e7eb',
            },
            xaxis: {
                ...options.xaxis,
                labels: {
                    ...options.xaxis?.labels,
                    style: {
                        ...options.xaxis?.labels?.style,
                        colors: '#6b7280',
                    },
                },
                axisBorder: {
                    ...options.xaxis?.axisBorder,
                    color: '#e5e7eb',
                },
                axisTicks: {
                    ...options.xaxis?.axisTicks,
                    color: '#e5e7eb',
                },
            },
            yaxis: {
                ...options.yaxis,
                labels: {
                    ...(typeof options.yaxis === 'object' && !Array.isArray(options.yaxis) ? options.yaxis.labels : {}),
                    style: {
                        ...(typeof options.yaxis === 'object' && !Array.isArray(options.yaxis) ? options.yaxis.labels?.style : {}),
                        colors: '#6b7280',
                    },
                },
            },
            tooltip: {
                ...options.tooltip,
                theme: 'light',
            },
            legend: {
                ...options.legend,
                labels: {
                    ...options.legend?.labels,
                    colors: '#374151',
                },
            },
        };
    }, [options]);
 
    return (
        <div className="chart-container">
            <ReactApexChart
                options={chartOptions}
                series={series}
                type={type}
                height={height}
                width={width}
            />
        </div>
    );
};
 
export default BaseChart;
 
 