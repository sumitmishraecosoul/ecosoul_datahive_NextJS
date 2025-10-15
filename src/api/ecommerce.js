import api from './api';

// Fetch Ecommerce Overview data
export const getEcommerceOverviewData = async (params = {}) => {
  const response = await api.get('/ecommerce/overview/data', { params });
  return response.data;
};

// Fetch Ecommerce Inventory data
export const getEcommerceInventoryData = async (params = {}) => {
  const response = await api.get('/ecommerce/inventory/data', { params });
  return response.data;
};

export const getEcommerceOverviewMetricCardData = async (params = {}) => {
  const response = await api.get('/ecommerce/overview/metric-card-data', { params });
  return response.data;
};

export const getEcommerceOverviewDIByGeography = async (params = {}) => {
  const response = await api.get('/ecommerce/overview/demand-instock-by-geography', { params });
  return response.data;
};

