'use client';
import React, { useState } from 'react'
import { CiFilter } from "react-icons/ci";
import { useToast } from './toast';

// Reusable filter selector
// Props:
// - title?: string
// - config: Array<{ key, label, placeholder }>
// - options: Record<key, Array<{value,label}>>
// - onChange?: (selected) => void
// - onClear?: () => void
// - className?: string
const FilterSelector = ({
  title = 'Filters',
  config = [],
  options = {},
  onChange,
  onClear,
  className = '',
}) => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const toast = useToast();

  const handleFilterChange = (filterKey, selectedOption) => {
    const next = { ...selectedFilters, [filterKey]: selectedOption };
    setSelectedFilters(next);
    onChange?.(next);
  };

  const handleClearWithToast = () => {
    setSelectedFilters({});
    onClear?.();
    toast.info('Filters cleared');
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg border border-gray-200 ${className}`}>
      <div className='flex flex-row items-center gap-3 mb-6'>
        <div className='p-2 bg-blue-50 rounded-lg'>
          <CiFilter size={24} color='#3b82f6' />
        </div>
        <h1 className='text-xl font-bold text-gray-800'>{title}</h1>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
        {config.map((filter) => (
          <div key={filter.key} className='flex flex-col min-w-0'>
            <label className='text-sm font-medium text-gray-700 mb-2'>{filter.label}</label>
            {Array.isArray(filter.options) && filter.options.length > 0 && filter.searchable ? (
              <>
                <input
                  list={`${filter.key}-datalist`}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400 hover:border-gray-400 shadow-sm"
                  placeholder={filter.placeholder || `Select ${filter.label}`}
                  value={selectedFilters[filter.key]?.value || ''}
                  onChange={(e) => handleFilterChange(filter.key, { value: e.target.value, label: e.target.value })}
                />
                <datalist id={`${filter.key}-datalist`}>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </datalist>
              </>
            ) : Array.isArray(filter.options) && filter.options.length > 0 ? (
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer placeholder:text-gray-400 hover:border-gray-400 shadow-sm"
                value={selectedFilters[filter.key]?.value || ''}
                onChange={(e) => handleFilterChange(filter.key, { value: e.target.value, label: e.target.value })}
              >
                <option value='' className='text-gray-400'>
                  {filter.placeholder || `Select ${filter.label}`}
                </option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type='text'
                className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400 hover:border-gray-400 shadow-sm'
                placeholder={filter.placeholder}
                value={selectedFilters[filter.key]?.value || ''}
                onChange={(e) => handleFilterChange(filter.key, { value: e.target.value, label: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>

      <div className='mt-6 pt-4 border-t border-gray-200'>
        <div className='flex justify-between items-center'>
          <div className='text-sm text-gray-500'>
            {Object.keys(selectedFilters).filter(key => selectedFilters[key]).length} filters applied
          </div>
          <button
            onClick={handleClearWithToast}
            className='text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors'
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterSelector