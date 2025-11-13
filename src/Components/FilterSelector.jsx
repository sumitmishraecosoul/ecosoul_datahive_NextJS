'use client';
import React, { useState, useRef, useEffect } from 'react'
import { CiFilter } from "react-icons/ci";
import { X, ChevronDown, Check } from "lucide-react";
import { useToast } from './toast';

// Reusable filter selector with multi-select support
// Props:
// - title?: string
// - config: Array<{ key, label, placeholder, options, searchable? }>
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
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const dropdownRefs = useRef({});
  const toast = useToast();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((key) => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          setOpenDropdowns(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (filterKey) => {
    setOpenDropdowns(prev => ({ ...prev, [filterKey]: !prev[filterKey] }));
  };

  const handleCheckboxChange = (filterKey, option) => {
    const current = selectedFilters[filterKey] || [];
    const isArray = Array.isArray(current);
    const currentValues = isArray ? current : (current ? [current] : []);
    
    const optionValue = typeof option === 'object' ? option.value : option;
    const optionLabel = typeof option === 'object' ? option.label : option;
    
    const isSelected = currentValues.some(v => {
      const val = typeof v === 'object' ? v.value : v;
      return val === optionValue;
    });

    let newValues;
    if (isSelected) {
      newValues = currentValues.filter(v => {
        const val = typeof v === 'object' ? v.value : v;
        return val !== optionValue;
      });
    } else {
      newValues = [...currentValues, { value: optionValue, label: optionLabel }];
    }

    const next = { ...selectedFilters, [filterKey]: newValues.length > 0 ? newValues : null };
    setSelectedFilters(next);
    onChange?.(next);
  };

  const removeFilter = (filterKey, valueToRemove) => {
    const current = selectedFilters[filterKey] || [];
    const isArray = Array.isArray(current);
    const currentValues = isArray ? current : (current ? [current] : []);
    
    const newValues = currentValues.filter(v => {
      const val = typeof v === 'object' ? v.value : v;
      return val !== valueToRemove;
    });

    const next = { ...selectedFilters, [filterKey]: newValues.length > 0 ? newValues : null };
    setSelectedFilters(next);
    onChange?.(next);
  };

  const handleClearWithToast = () => {
    setSelectedFilters({});
    setSearchTerms({});
    setOpenDropdowns({});
    onClear?.();
    toast.info('Filters cleared');
  };

  const getSelectedCount = (filterKey) => {
    const current = selectedFilters[filterKey];
    if (!current) return 0;
    if (Array.isArray(current)) return current.length;
    return 1;
  };

  const getDisplayText = (filter) => {
    const current = selectedFilters[filter.key];
    if (!current) return filter.placeholder || `Select ${filter.label}`;
    if (Array.isArray(current)) {
      if (current.length === 0) return filter.placeholder || `Select ${filter.label}`;
      if (current.length === 1) return current[0].label || current[0].value || current[0];
      return `${current.length} selected`;
    }
    return current.label || current.value || current;
  };

  const getFilteredOptions = (filter) => {
    const searchTerm = searchTerms[filter.key]?.toLowerCase() || '';
    if (!searchTerm) return filter.options || [];
    return (filter.options || []).filter(opt => {
      const label = opt.label || opt.value || '';
      const value = opt.value || '';
      return label.toLowerCase().includes(searchTerm) || value.toLowerCase().includes(searchTerm);
    });
  };

  const isOptionSelected = (filterKey, optionValue) => {
    const current = selectedFilters[filterKey];
    if (!current) return false;
    const currentValues = Array.isArray(current) ? current : [current];
    return currentValues.some(v => {
      const val = typeof v === 'object' ? v.value : v;
      return val === optionValue;
    });
  };

  const getAllSelectedFilters = () => {
    const result = [];
    Object.keys(selectedFilters).forEach(key => {
      const current = selectedFilters[key];
      if (!current) return;
      const filterConfig = config.find(f => f.key === key);
      if (!filterConfig) return;
      
      const values = Array.isArray(current) ? current : [current];
      values.forEach(v => {
        const label = typeof v === 'object' ? v.label : v;
        const value = typeof v === 'object' ? v.value : v;
        result.push({ filterKey: key, filterLabel: filterConfig.label, value, label });
      });
    });
    return result;
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
        {config.map((filter) => {
          const hasOptions = Array.isArray(filter.options) && filter.options.length > 0;
          const isOpen = openDropdowns[filter.key] || false;
          const selectedCount = getSelectedCount(filter.key);
          const filteredOptions = getFilteredOptions(filter);

          return (
            <div key={filter.key} className='flex flex-col min-w-0 relative' ref={el => dropdownRefs.current[filter.key] = el}>
              <label className='text-sm font-medium text-gray-700 mb-2'>{filter.label}</label>
              {hasOptions ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(filter.key)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-left text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400 shadow-sm flex items-center justify-between"
                  >
                    <span className={`truncate ${selectedCount > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                      {getDisplayText(filter)}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Search"
                          value={searchTerms[filter.key] || ''}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, [filter.key]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="overflow-y-auto max-h-48">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((opt) => {
                            const optValue = opt.value || opt;
                            const optLabel = opt.label || opt.value || opt;
                            const isSelected = isOptionSelected(filter.key, optValue);
                            
                            return (
                              <label
                                key={optValue}
                                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleCheckboxChange(filter.key, opt)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-700 flex-1">{optLabel}</span>
                                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                              </label>
                            );
                          })
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500 text-center">No options found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type='text'
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400 hover:border-gray-400 shadow-sm'
                  placeholder={filter.placeholder}
                  value={selectedFilters[filter.key]?.value || ''}
                  onChange={(e) => {
                    const next = { ...selectedFilters, [filter.key]: { value: e.target.value, label: e.target.value } };
                    setSelectedFilters(next);
                    onChange?.(next);
                  }}
                />
              )}
              {selectedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Filters Display */}
      {getAllSelectedFilters().length > 0 && (
        <div className='mt-6 pt-4 border-t border-gray-200'>
          <div className='mb-3'>
            <h3 className='text-sm font-semibold text-gray-700 mb-2'>Selected Filters:</h3>
            <div className='flex flex-wrap gap-2'>
              {getAllSelectedFilters().map((item, idx) => (
                <span
                  key={`${item.filterKey}-${item.value}-${idx}`}
                  className='inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200'
                >
                  <span className='font-medium'>{item.filterLabel}:</span>
                  <span>{item.label}</span>
                  <button
                    onClick={() => removeFilter(item.filterKey, item.value)}
                    className='ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className='mt-6 pt-4 border-t border-gray-200'>
        <div className='flex justify-between items-center'>
          <div className='text-sm text-gray-500'>
            {getAllSelectedFilters().length} filter{getAllSelectedFilters().length !== 1 ? 's' : ''} applied
          </div>
          <button
            onClick={handleClearWithToast}
            className='text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors px-3 py-1 hover:bg-blue-50 rounded-md'
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterSelector