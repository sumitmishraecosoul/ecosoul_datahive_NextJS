'use client';
import React from 'react';
import MetricTable from '../../../../Components/MetricTable';
import { Button } from '../../../../Components/Button';
import { getEcommerceInventoryData } from '../../../../api/ecommerce';
import DEV_URL from '../../../../config/config';
import { useToast } from '../../../../Components/toast';

export default function ECommerceInventoryPage() {
  const [rows, setRows] = React.useState([]);
  const toast = useToast();

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

  const handleDownload = async () => {
    try {
      const response = await fetch(`${DEV_URL}/ecommerce/download/overview`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to download');

      const blob = await response.blob();

      // Try to infer filename from Content-Disposition
      const disposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
      let fileName = 'ecommerce-inventory.csv';
      if (disposition) {
        const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^;"]+)"?/i);
        const extracted = match?.[1] || match?.[2];
        if (extracted) fileName = decodeURIComponent(extracted);
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success('Download completed');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Download failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
        <Button 
          onClick={handleDownload}
          className="ml-4"
          showDownloadIcon
        >
          Download CSV
        </Button>
      </div>

      <MetricTable rows={rows} columns={columns} />
    </div>
  );
}


