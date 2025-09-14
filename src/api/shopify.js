import axios from "axios";

const API_BASE = "https://shopify-admin-backend-rgkc.onrender.com/api";


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
  return res.data; 
};


export const loginTenant = async (email, password) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data; 
};


const configWithTenant = (tenantId) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-tenant-id": tenantId,
    },
  };
};


export const getCustomers = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required for getCustomers");
  const res = await axios.get(
    `${API_BASE}/shopify/customers`,
    configWithTenant(tenantId)
  );
  return res.data || [];
};


export const getOrders = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required for getOrders");
  const res = await axios.get(
    `${API_BASE}/shopify/orders`,
    configWithTenant(tenantId)
  );
  return res.data || [];
};


export const getProducts = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required for getProducts");
  const res = await axios.get(
    `${API_BASE}/shopify/products`,
    configWithTenant(tenantId)
  );
  return res.data || [];
};


export const syncData = async (type, tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required for syncData");

  try {
    const res = await axios.post(
      `${API_BASE}/sync/${type}`,
      {}, 
      configWithTenant(tenantId)
    );
    console.log(`${type} synced:`, res.data.count);
    return res.data;
  } catch (err) {
    console.error(`Failed to sync ${type}:`, err.response?.data || err.message);
    throw err;
  }
};

