// frontend/src/api/shopify.js
import axios from "axios";

const API_BASE = "https://shopify-admin-backend-rgkc.onrender.com/api";

// --------------------
// Tenant signup
// --------------------
export const signupTenant = async (
  name,
  email,
  password,
  shopDomain,
  accessToken
) => {
  const res = await axios.post(`${API_BASE}/auth/signup`, {
    name,
    email,
    password,
    shopDomain,
    accessToken,
  });
  return res.data; // { success, tenant }
};

// --------------------
// Tenant login
// --------------------
export const loginTenant = async (email, password) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data; // { success, token, tenant }
};

// --------------------
// Helper: attach tenantId + token
// --------------------
const configWithTenant = (tenantId) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-tenant-id": tenantId,
    },
  };
};

// --------------------
// Fetch customers
// --------------------
export const getCustomers = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required for getCustomers");
  const res = await axios.get(
    `${API_BASE}/shopify/customers`,
    configWithTenant(tenantId)
  );
  return res.data || [];
};

// --------------------
// Fetch orders
// --------------------
export const getOrders = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required for getOrders");
  const res = await axios.get(
    `${API_BASE}/shopify/orders`,
    configWithTenant(tenantId)
  );
  return res.data || [];
};

// --------------------
// Fetch products
// --------------------
export const getProducts = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required for getProducts");
  const res = await axios.get(
    `${API_BASE}/shopify/products`,
    configWithTenant(tenantId)
  );
  return res.data || [];
};

// --------------------
// Sync data (customers, orders, products) from Shopify → DB
// --------------------
export const syncData = async (type, tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required for syncData");

  try {
    const res = await axios.post(
      `${API_BASE}/sync/${type}`,
      {}, // no body needed, backend uses tenantId header
      configWithTenant(tenantId)
    );
    console.log(`${type} synced:`, res.data.count);
    return res.data;
  } catch (err) {
    console.error(`Failed to sync ${type}:`, err.response?.data || err.message);
    throw err;
  }
};
