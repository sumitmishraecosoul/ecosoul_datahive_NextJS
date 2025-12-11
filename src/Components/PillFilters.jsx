'use client';

import React, { useEffect, useState } from 'react';

// Mock "API" call for pill filters – replace with real backend integration later
const fetchPillFilters = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'home-essentials', label: 'Home Essentials' },
        { id: 'kitchen', label: 'Kitchen' },
        { id: 'electronics', label: 'Electronics' },
        { id: 'furniture', label: 'Furniture' },
        { id: 'home-decor', label: 'Home Decor' },
        { id: 'outdoor', label: 'Outdoor' },
        { id: 'storage', label: 'Storage' },
      ]);
    }, 250);
  });

/**
 * PillFilters
 *
 * Props:
 * - title?: string                           // Section heading, e.g. "Categories"
 * - onChange?: (selectedIds: string[]) => {} // Called when pills are (de)selected
 * - initialSelectedId?: string               // Optional default selected pill
 * - className?: string                       // Extra wrapper classes
 */
const PillFilters = ({
  title = 'Categories',
  onChange,
  initialSelectedId = null,
  className = '',
}) => {
  const [filters, setFilters] = useState([]);
  const [selectedIds, setSelectedIds] = useState(
    initialSelectedId ? [initialSelectedId] : []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadFilters = async () => {
      try {
        setLoading(true);
        const data = await fetchPillFilters();
        if (!isMounted) return;
        setFilters(data || []);

        // If initialSelectedId is provided and exists in data, keep it selected
        if (initialSelectedId && data.some((f) => f.id === initialSelectedId)) {
          setSelectedIds([initialSelectedId]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load pill filters', err);
        setError('Unable to load categories');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFilters();

    return () => {
      isMounted = false;
    };
  }, [initialSelectedId]);

  const handleSelect = (id) => {
    // Toggle behaviour with multi-select support
    setSelectedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      onChange?.(next);
      return next;
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold tracking-[0.18em] text-gray-500 uppercase">
          {title}
        </h2>
        {loading && (
          <span className="text-[11px] text-gray-400">Loading...</span>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Pills row */}
      {!error && (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 pr-1 -mx-1 px-1">
            {filters.map((filter) => {
              const isActive = selectedIds.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => handleSelect(filter.id)}
                  className={[
                    'relative inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap border transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700',
                  ].join(' ')}
                >
                  <span className="relative z-10 font-medium">
                    {filter.label}
                  </span>
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-blue-400/30 blur-md opacity-70" />
                  )}
                </button>
              );
            })}

            {!loading && filters.length === 0 && (
              <span className="text-xs text-gray-500">
                No categories available.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PillFilters;


