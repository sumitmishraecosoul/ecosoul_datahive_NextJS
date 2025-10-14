'use client';
import React, { useState, useEffect } from 'react';

const TabSelector = ({ 
  tabs = ['Overview','Quick Commerce'], 
  onTabChange,
  defaultActiveTab = 0 
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  // Update active tab when defaultActiveTab changes (for navigation)
  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index, tabs[index]);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`
            px-5 py-3 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ease-in-out
            min-w-20 text-center whitespace-nowrap outline-none font-semibold
            ${activeTab === index 
              ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 transform -translate-y-0.5' 
              : 'bg-gray-200 text-gray-600 shadow-sm hover:bg-gray-300 hover:shadow-md hover:-translate-y-0.5'
            }
            hover:shadow-lg
            active:transform active:translate-y-0
          `}
          onClick={() => handleTabClick(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;