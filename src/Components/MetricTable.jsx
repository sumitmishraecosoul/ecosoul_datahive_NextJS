'use client';
import React, { useState } from 'react';
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

const MetricTable = ({ title, rows, columns }) => {
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
  
  const theme = {
    Table: `
      --data-table-library_grid-template-columns: repeat(10, 1fr);
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    `,
    HeaderCell: `
      background-color: #e5e7eb;
      color: #000000;
      text-align: centre;
      font-weight: 500;
      font-size: 12px;
      padding: 14px;
      border-bottom: 2px solid #e5e7eb;
      letter-spacing: 0.01em;
      position: sticky;
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
        padding: 16px;
        font-size: 12px;
        color: #374151;
        border-bottom: 1px solid #f3f4f6;
        text-align: left;
        vertical-align: middle;
      }
    `,
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl shadow-md p-4 w-full">
      <div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
      </div>
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
      <div className="max-h-96 overflow-y-auto">
        <CompactTable columns={tableColumns} data={data} theme={theme} />
      </div>
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
