'use client';

import React, { useState, useEffect } from 'react';
import FilterSelector from "../../../../../../Components/FilterSelector.jsx";
import MetricTable from "../../../../../../Components/MetricTable.jsx";
import { getKeheKSolveFilters, getKeheKSolveInvoiceDeduction, getKeheKSolveInvoiceAmount, getKeheKSolveMetricTableData } from "../../../../../../api/retail.js";

const twoCol = [
  { label: 'Field', renderCell: (item) => item.field || '-' },
  { label: 'Value', renderCell: (item) => item.value || '-' },
];

const fiveCol = [
  { label: 'Invoice Number', renderCell: (item) => item.c1 || '-' },
  { label: 'Invoice Date', renderCell: (item) => item.c2 || '-' },
  { label: 'Category Type', renderCell: (item) => item.c3 || '-' },
  { label: 'Invoice Total', renderCell: (item) => item.c4 || '-' },
  { label: 'Net Payable', renderCell: (item) => item.c5 || '-' },
];

export default function KSolvePage() {
  // Filter options state
  const [invoiceNoOptions, setInvoiceNoOptions] = useState([]);
  const [categoryTypeOptions, setCategoryTypeOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [poNoOptions, setPoNoOptions] = useState([]);
  const [dcNameOptions, setDcNameOptions] = useState([]);
  const [dateOptions, setDateOptions] = useState([]);

  // Table data state
  const [rowsA, setRowsA] = useState([]);
  const [rowsB, setRowsB] = useState([]);
  const [rowsC, setRowsC] = useState([]);
  const [rowsFive, setRowsFive] = useState([]);
  const [filters, setFilters] = useState({});

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getKeheKSolveFilters();
        const invoiceNoList = Array.isArray(data?.Invoice_No) ? data.Invoice_No : [];
        const categoryTypeList = Array.isArray(data?.Category_Type) ? data.Category_Type : [];
        const typeList = Array.isArray(data?.Type) ? data.Type : [];
        const statusList = Array.isArray(data?.Status) ? data.Status : [];
        const poNoList = Array.isArray(data?.PO_No) ? data.PO_No : [];
        const dcNameList = Array.isArray(data?.DC_Name) ? data.DC_Name : [];
        const dateList = Array.isArray(data?.Date) ? data.Date : [];
        
        setInvoiceNoOptions(invoiceNoList.map((v) => ({ value: v, label: v })));
        setCategoryTypeOptions(categoryTypeList.map((v) => ({ value: v, label: v })));
        setTypeOptions(typeList.map((v) => ({ value: v, label: v })));
        setStatusOptions(statusList.map((v) => ({ value: v, label: v })));
        setPoNoOptions(poNoList.map((v) => ({ value: v, label: v })));
        setDcNameOptions(dcNameList.map((v) => ({ value: v, label: v })));
        setDateOptions(dateList.map((v) => ({ value: v, label: v })));
      } catch (e) {
        console.error('Error fetching filter options:', e);
      }
    };
    fetchFilters();
  }, []);

  const filterConfig = [
    { key: 'Invoice_No', label: 'Invoice Number', placeholder: 'Invoice Numbers', options: invoiceNoOptions, searchable: true },
    { key: 'Category_Type', label: 'Category Type', placeholder: 'All Category Types', options: categoryTypeOptions, searchable: true },
    { key: 'Type', label: 'Type', placeholder: 'All Types', options: typeOptions, searchable: true },
    { key: 'Status', label: 'Status', placeholder: 'All Statuses', options: statusOptions, searchable: true },
    { key: 'PO_No', label: 'PO Number', placeholder: 'All POs', options: poNoOptions, searchable: true },
    { key: 'DC_Name', label: 'DC Name', placeholder: 'All DC Names', options: dcNameOptions, searchable: true },
    { key: 'Date', label: 'Date', placeholder: 'All Dates', options: dateOptions, searchable: true },
  ];

  // Fetch invoice deduction data for first table
  useEffect(() => {
    const fetchInvoiceDeductionA = async () => {
      try {
        const data = await getKeheKSolveInvoiceDeduction(filters);
        // Transform object to array format for table
        const tableData = Object.entries(data || {}).map(([field, value]) => ({
          field,
          value: typeof value === 'number' ? value.toFixed(2) : value
        }));
        setRowsA(tableData);
      } catch (e) {
        console.error('Error fetching invoice deduction data:', e);
        setRowsA([]);
      }
    };
    fetchInvoiceDeductionA();
  }, [filters]);

  // Fetch invoice deduction data for second table
  useEffect(() => {
    const fetchInvoiceDeductionB = async () => {
      try {
        const data = await getKeheKSolveInvoiceDeduction(filters);
        // Transform object to array format for table
        const tableData = Object.entries(data || {}).map(([field, value]) => ({
          field,
          value: typeof value === 'number' ? value.toFixed(2) : value
        }));
        setRowsB(tableData);
      } catch (e) {
        console.error('Error fetching invoice deduction data:', e);
        setRowsB([]);
      }
    };
    fetchInvoiceDeductionB();
  }, [filters]);

  // Fetch invoice amount data for third table
  useEffect(() => {
    const fetchInvoiceAmount = async () => {
      try {
        const data = await getKeheKSolveInvoiceAmount(filters);
        // Transform object to array format for table
        const tableData = Object.entries(data || {}).map(([field, value]) => ({
          field,
          value: typeof value === 'number' ? value.toFixed(2) : value
        }));
        setRowsC(tableData);
      } catch (e) {
        console.error('Error fetching invoice amount data:', e);
        setRowsC([]);
      }
    };
    fetchInvoiceAmount();
  }, [filters]);

  // Fetch metric table data for fourth table
  useEffect(() => {
    const fetchMetricTableData = async () => {
      try {
        const data = await getKeheKSolveMetricTableData(filters);
        // Transform data to array format for table
        // API may return single object or array of objects
        let tableData = [];
        if (Array.isArray(data)) {
          tableData = data.map((item) => ({
            c1: item?.Invoice || item?.invoice || '-',
            c2: item?.['Invoice Date'] || item?.invoiceDate || item?.Invoice_Date || '-',
            c3: item?.['Category Type'] || item?.categoryType || item?.Category_Type || '-',
            c4: item?.['Invoice Total'] || item?.invoiceTotal || item?.Invoice_Total || '-',
            c5: item?.['Net Payable'] || item?.netPayable || item?.Net_Payable || '-',
          }));
        } else if (data && typeof data === 'object') {
          // Single object - wrap in array
          tableData = [{
            c1: data?.Invoice || data?.invoice || '-',
            c2: data?.['Invoice Date'] || data?.invoiceDate || data?.Invoice_Date || '-',
            c3: data?.['Category Type'] || data?.categoryType || data?.Category_Type || '-',
            c4: data?.['Invoice Total'] || data?.invoiceTotal || data?.Invoice_Total || '-',
            c5: data?.['Net Payable'] || data?.netPayable || data?.Net_Payable || '-',
          }];
        }
        setRowsFive(tableData);
      } catch (e) {
        console.error('Error fetching metric table data:', e);
        setRowsFive([]);
      }
    };
    fetchMetricTableData();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    const simple = {};
    Object.keys(newFilters || {}).forEach((key) => {
      const v = newFilters[key];
      simple[key] = typeof v === 'object' ? (v?.value || '') : (v || '');
    });
    setFilters(simple);
  };

  const handleClear = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
    {/* Filters */}
    <FilterSelector
      title="Filters"
      config={filterConfig}
      options={{}}
      onChange={handleFilterChange}
      onClear={handleClear}
    />

    {/* Three tables; try to keep in one row when possible */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <MetricTable title="Invoice Total % Deduction by Category" rows={rowsA} columns={twoCol} showSearch={false} titleClassName="text-lg font-semibold text-black" />
      <MetricTable title="Net Payable & Deduction by Category" rows={rowsB} columns={twoCol} showSearch={false} titleClassName="text-lg font-semibold text-black" />
      <MetricTable title="Invoice Amount by Category" rows={rowsC} columns={twoCol} showSearch={false} titleClassName="text-lg font-semibold text-black" />
    </div>

    {/* Five column table */}
    <MetricTable title="Retail Metrics" rows={rowsFive} columns={fiveCol} showSearch={false} titleClassName="text-lg font-semibold text-black" />
  </div>
  );
}