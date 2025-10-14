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
    <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 w-[50rem] max-w-xs hover:scale-105 transition-all duration-300 shadow-xl">
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
      <div className="flex w-[3rem] h-[3rem] items-center justify-center bg-blue-100 rounded-lg p-2">
        {icon}
      </div>
    </div>
  );
};

export default MetricCard;
