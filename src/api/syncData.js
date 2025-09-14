import axios from "axios";

const API_BASE = "https://shopify-admin-backend-rgkc.onrender.com/api";

export default async function syncData(type, tenantId) {
  try {
    const url = `${API_BASE}/sync/${type}?tenantId=${tenantId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("Error syncing data:", err);
    return null;
  }
}
