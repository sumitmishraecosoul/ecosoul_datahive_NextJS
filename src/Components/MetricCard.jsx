'use client';
import React from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";

const MetricCard = (
  {
    title,
    value,
    profitLoss,
    profitLossText,
    icon
  }
) => {
  return (
    <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] p-5 w-[15rem] max-w-xs hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.2)] transition-all duration-300">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {profitLoss && (
          <div className={`flex items-center ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profitLoss >= 0 ? <FaArrowUpLong className="mr-1" /> : <FaArrowDownLong className="mr-1" />}
            <span className="text-sm">{Math.abs(profitLoss)}% {profitLossText}</span>
          </div>
        )}
      </div>
      <div className="flex w-[3rem] h-[3rem] items-center justify-center rounded-xl p-2  border border-gray-400 border-2">
        {icon}
      </div>
    </div>
  );
};

export default MetricCard;
