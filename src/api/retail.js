import api from './api';

// Fetch Kehe K-Solve filters
export const getKeheKSolveFilters = async () => {
  const response = await api.get('/retail/kehe-ksolve/filters');
  return response.data;
};

// Fetch Kehe K-Solve invoice deduction data
export const getKeheKSolveInvoiceDeduction = async (params = {}) => {
  const response = await api.get('/retail/kehe-ksolve/invoice-deduction', { params });
  return response.data;
};

// Fetch Kehe K-Solve invoice amount data
export const getKeheKSolveInvoiceAmount = async (params = {}) => {
  const response = await api.get('/retail/kehe-ksolve/invoice-amount', { params });
  return response.data;
};

// Fetch Kehe K-Solve metric table data
export const getKeheKSolveMetricTableData = async (params = {}) => {
  const response = await api.get('/retail/kehe-ksolve/metric-table-data', { params });
  return response.data;
};

