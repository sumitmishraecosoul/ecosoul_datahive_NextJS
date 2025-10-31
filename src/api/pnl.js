import api from './api';

// Fetch transaction tab KPI metrics for PNL
export const getPnlTransactionMetricData = async (params = {}) => {
  const response = await api.get('/pnl/transaction/metric-data', { params });
  return response.data;
};

// Fetch transaction tab table data for PNL
export const getPnlTransactionTableData = async (params = {}) => {
  const response = await api.get('/pnl/transaction/metric-table-data', { params });
  return response.data;
};

// Fetch business tab KPI metrics for PNL
export const getPnlBusinessMetricData = async (params = {}) => {
  const response = await api.get('/pnl/business/metric-data', { params });
  return response.data;
};

// Fetch business tab table data for PNL
export const getPnlBusinessTableData = async (params = {}) => {
  const response = await api.get('/pnl/business/metric-table-data', { params });
  return response.data;
};