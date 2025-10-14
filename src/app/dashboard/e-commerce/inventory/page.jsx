'use client';
import React from 'react';
import MetricTable from '../../../../Components/MetricTable';
import { getEcommerceInventoryData } from '../../../../api/ecommerce';

export default function ECommerceInventoryPage() {
  const [rows, setRows] = React.useState([]);

  const columns = [
    { label: 'SKU', renderCell: (item) => item['SKU'] || '' },
    { label: 'Country', renderCell: (item) => item['Country'] || '' },
    { label: 'afn-fulfillable-quantity', renderCell: (item) => item['afn-fulfillable-quantity'] || '' },
    { label: 'afn-inbound-working-quantity', renderCell: (item) => item['afn-inbound-working-quantity'] || '' },
    { label: 'afn-inbound-shipped-quantity', renderCell: (item) => item['afn-inbound-shipped-quantity'] || '' },
    { label: 'afn-inbound-receiving-quantity', renderCell: (item) => item['afn-inbound-receiving-quantity'] || '' },
    { label: 'Customer_reserved', renderCell: (item) => item['Customer_reserved'] || '' },
    { label: 'FC_Transfer', renderCell: (item) => item['FC_Transfer'] || '' },
    { label: 'FC_Processing', renderCell: (item) => item['FC_Processing'] || '' },
    { label: 'Material', renderCell: (item) => item['Material'] || '' },
    { label: 'Product_Category', renderCell: (item) => item['Product_Category'] || '' },
    { label: 'Product_Sub_Category', renderCell: (item) => item['Product_Sub_Category'] || '' },
    { label: 'Product_Type', renderCell: (item) => item['Product_Type'] || '' },
  ];

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await getEcommerceInventoryData();
        const normalized = Array.isArray(data) ? data : (data?.data || []);
        setRows(normalized);
      } catch (err) {
        console.error('Failed to load ecommerce inventory data', err);
        setRows([]);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <MetricTable rows={rows} columns={columns} />
    </div>
  );
}


