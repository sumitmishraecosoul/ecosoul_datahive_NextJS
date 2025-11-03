'use client';
import React, { useMemo } from "react";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";

// Displays a compact metric card, intended for use inside the nested card grid
const CompactMetric = ({ title, value, profitLoss, profitLossText, icon }) => {
  const isPositive = typeof profitLoss === "number" ? profitLoss >= 0 : null;

  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-medium text-gray-600 truncate max-w-[10rem]">{title}</h4>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
        {typeof profitLoss === "number" && (
          <div className={`flex items-center text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? (
              <FaArrowUpLong className="mr-1" />
            ) : (
              <FaArrowDownLong className="mr-1" />
            )}
            <span>{Math.abs(profitLoss)}% {profitLossText}</span>
          </div>
        )}
      </div>
      {icon && (
        <div className="flex w-8 h-8 items-center justify-center bg-blue-50 rounded-md text-blue-600">
          {icon}
        </div>
      )}
    </div>
  );
};

/*
  NestedMetricCard renders a larger container card that can hold multiple
  compact metric cards inside. The number of nested cards and the title of
  the larger card are controlled via props.

  Props:
  - title: string (title of the larger card)
  - metrics: Array<{ title, value, profitLoss?, profitLossText?, icon? }>
  - count?: number (optional cap on how many metric items to show)
  - columns?: 1|2|3|4 (optional grid columns; defaults based on item count)
*/
const NestedMetricCard = ({ title, metrics = [], count, columns }) => {
  const itemsToRender = useMemo(() => {
    const base = typeof count === "number" ? metrics.slice(0, count) : metrics;
    return base;
  }, [metrics, count]);

  // Choose a sensible default grid based on number of items when columns not provided
  const computedColumns = columns || (itemsToRender.length >= 4 ? 4 : itemsToRender.length >= 3 ? 3 : itemsToRender.length >= 2 ? 2 : 1);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {typeof count === "number" && (
          <span className="text-xs text-gray-500">Showing {itemsToRender.length}{metrics.length > itemsToRender.length ? ` of ${metrics.length}` : ""}</span>
        )}
      </div>

      {/* Responsive grid: 1 col < md, 2 cols for widths <1440px (including md/lg/xl), 3 cols for >=1440px */}
      <div
        className={`grid gap-3 grid-cols-1 md:grid-cols-2 min-[1440px]:grid-cols-3`}
      >
        {itemsToRender.map((m, index) => (
          <CompactMetric
            key={index}
            title={m.title}
            value={m.value}
            profitLoss={m.profitLoss}
            profitLossText={m.profitLossText}
            icon={m.icon}
          />)
        )}
      </div>
    </div>
  );
};

export default NestedMetricCard;


