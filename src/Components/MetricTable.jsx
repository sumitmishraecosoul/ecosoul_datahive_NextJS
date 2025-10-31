'use client';
import React, { useState, useRef, useEffect } from 'react';
import { CompactTable } from '@table-library/react-table-library/compact';

// rows are provided by parent; no static demo data here

const DEFAULT_COLUMNS = [
  { label: 'SKU', renderCell: (item) => item.sku },
  { label: 'CATEGORY', renderCell: (item) => item.category },
  { label: 'MATERIAL', renderCell: (item) => item.material },
  { label: 'PLATFORM', renderCell: (item) => item.platform },
  { label: 'REGION', renderCell: (item) => item.region },
  { label: 'ASIN', renderCell: (item) => item.asin },
  { 
    label: 'AVAILABLE', 
    renderCell: (item) => (
      <span className="text-green-600 font-medium">
        {item.available?.toLocaleString() || '-'}
      </span>
    )
  },
  { label: '30D SALES', renderCell: (item) => item.sales30d?.toLocaleString() || '-' },
  { label: '7D SALES', renderCell: (item) => item.sales7d?.toLocaleString() || '-' },
  { 
    label: 'DOS', 
    renderCell: (item) => (
      <span className="text-blue-600 font-medium">
        {item.dos || '-'}
      </span>
    )
  },
];

const MetricTable = ({ title, rows, columns, showSearch = true, scrollable = true }) => {
  const [skuInput, setSkuInput] = useState('');
  const [appliedSku, setAppliedSku] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const baseNodes = Array.isArray(rows) ? rows.map((item, index) => ({
    ...item,
    id: item.id || `row-${index}` // Always use index-based ID to ensure uniqueness
  })) : [];

  const filteredNodes = React.useMemo(() => {
    if (!appliedSku || appliedSku.trim() === '') return baseNodes;
    const query = appliedSku.trim().toLowerCase();
    return baseNodes.filter((item) => {
      // Handle different possible SKU field names and data structures
      const skuValue = item.sku || item.SKU || item.id || item.product_id || '';
      return String(skuValue).toLowerCase().includes(query);
    }).map((item, index) => ({
      ...item,
      id: item.id || `filtered-row-${index}` // Ensure filtered rows also have unique IDs
    }));
  }, [appliedSku, baseNodes]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [appliedSku, rows]);

  const totalPages = Math.max(1, Math.ceil(filteredNodes.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const pagedNodes = filteredNodes.slice(startIdx, startIdx + pageSize).map((item, index) => ({
    ...item,
    id: item.id || `page-${safePage}-row-${index}` // Ensure paginated rows have unique IDs
  }));

  const data = { nodes: pagedNodes };
  const tableColumns = Array.isArray(columns) && columns.length > 0 
    ? columns.map((col, index) => ({ ...col, id: col.id || col.label || `col-${index}` }))
    : DEFAULT_COLUMNS.map((col, index) => ({ ...col, id: col.id || col.label || `col-${index}` }));

  // Dynamically size columns to fit header text and enable wrapping
  const columnCount = Math.max(1, tableColumns.length);
  // Give each column a reasonable min width and allow it to grow; avoid forced ellipsis
  const gridTemplate = `repeat(${columnCount}, minmax(120px, auto))`;

  const theme = {
    Table: `
      --data-table-library_grid-template-columns: ${gridTemplate};
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    `,
    HeaderCell: `
      background-color: #e5e7eb;
      color: #000000;
      text-align: left;
      font-weight: 500;
      font-size: 12px;
      padding: 10px 12px;
      border-bottom: 2px solid #e5e7eb;
      letter-spacing: 0.01em;
      position: sticky;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      word-break: break-word;
      line-height: 1.2;
      /* Override inner container from table-library that applies ellipsis */
      & > div {
        white-space: normal !important;
        overflow: visible !important;
        text-overflow: clip !important;
        word-break: break-word !important;
      }
    `,
    Body: `
      .tr {
        background-color: #fff;
        &:nth-of-type(even) {
          background-color: #f9fafb;
        }
        &:hover {
          background-color: #f1f5f9;
        }
      }
      .td {
        padding: 10px 12px;
        font-size: 12px;
        color: #374151;
        border-bottom: 1px solid #f3f4f6;
        text-align: left;
        vertical-align: middle;
      }
    `,
  };

  const hScrollRef = useRef(null); // sticky horizontal scrollbar
  const contentScrollRef = useRef(null); // actual content horizontal scroller
  const [spacerWidth, setSpacerWidth] = useState(0);

  useEffect(() => {
    if (!scrollable) return;
    const updateWidths = () => {
      const el = contentScrollRef.current;
      if (!el) return;
      setSpacerWidth(el.scrollWidth);
    };
    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, [tableColumns.length, data.nodes.length, scrollable]);

  const syncFromSticky = (e) => {
    const target = e.currentTarget;
    if (contentScrollRef.current && contentScrollRef.current.scrollLeft !== target.scrollLeft) {
      contentScrollRef.current.scrollLeft = target.scrollLeft;
    }
  };

  const syncFromContent = (e) => {
    const target = e.currentTarget;
    if (hScrollRef.current && hScrollRef.current.scrollLeft !== target.scrollLeft) {
      hScrollRef.current.scrollLeft = target.scrollLeft;
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl shadow-md p-4 w-full">
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">{title}</h1>
      </div>
      {showSearch && (
        <>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setAppliedSku(skuInput);
              }}
              placeholder="Search by SKU"
              className="w-full max-w-xs border rounded-md text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setAppliedSku(skuInput)}
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-md"
            >
              Search
            </button>
            {appliedSku && (
              <button
                onClick={() => {
                  setAppliedSku('');
                  setSkuInput('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
          {appliedSku && (
            <div className="text-sm text-gray-600">
              Showing {filteredNodes.length} of {baseNodes.length} results for "{appliedSku}"
            </div>
          )}
        </>
      )}
      {scrollable ? (
        <div className="max-h-96 overflow-y-auto relative">
          <div
            ref={contentScrollRef}
            onScroll={syncFromContent}
            className="overflow-x-auto scroll-container hide-x-scrollbar pb-4 w-full"
          >
            <div className="min-w-max">
              <CompactTable columns={tableColumns} data={data} theme={theme} />
            </div>
          </div>
          {/* right edge aesthetic border */}
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-px bg-gray-200" />
          <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200">
            <div
              ref={hScrollRef}
              onScroll={syncFromSticky}
              className="overflow-x-auto scroll-container"
            >
              <div style={{ width: spacerWidth, height: 1 }} />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <CompactTable columns={tableColumns} data={data} theme={theme} />
        </div>
      )}
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={safePage === 1}
          className={`px-3 py-1 rounded-md text-sm border ${safePage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 border-gray-300'}`}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {safePage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={safePage === totalPages}
          className={`px-3 py-1 rounded-md text-sm border ${safePage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 border-gray-300'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MetricTable;
