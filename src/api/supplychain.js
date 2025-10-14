import api from "./api";

export const getSCOverviewMetrics = async ({ sku = "", channel = "" } = {}) => {
  // Backend provides metrics via quick-commerce/metrics for overview too
  const response = await api.get("/supply-chain/quick-commerce/metrics", {
    params: { sku, channel },
  });
  return response.data;
};

export const getSCOverviewData = async ({ sku = "", channel = "" } = {}) => {
  const response = await api.get("/supply-chain/overview/data", {
    params: { sku, channel },
  });
  return response.data;
};

export const getQuickCommerceMetrics = async ({ sku = "", location = "" } = {}) => {
  const response = await api.get("/supply-chain/quick-commerce/metric-card-data", {
    params: { sku, location },
  });
  return response.data;
};

export const getQuickCommerceData = async ({ sku = "", location = "" } = {}) => {
  const response = await api.get("/supply-chain/quick-commerce/data", {
    params: { sku, location },
  });
  return response.data;
};

export const getSCOverviewDataDownload = async () => {
  const response = await api.get("/supply-chain/download/sc-overview-csv", {
  });
  return response.data;
};


export const getQuickCommerceDataDownload = async () => {
  const response = await api.get("/supply-chain/download/sc-quick-commerce-csv", {
  });
  return response.data;
};
