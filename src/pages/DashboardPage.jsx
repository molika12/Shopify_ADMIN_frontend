import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MetricCard } from "../components/MetricCard";
import { OrdersChart } from "../components/OrdersChart";
import { TopCustomers } from "../components/TopCustomers";
import { getOrders, getCustomers, getProducts } from "../api/shopify";
import syncData from "../api/syncData";
import { Users, ShoppingBag, DollarSign, Package } from "lucide-react";

export default function DashboardPage() {
  const tenantId = localStorage.getItem("tenantId");
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerStats, setCustomerStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 First sync data from Shopify → DB → then fetch from DB
  useEffect(() => {
    const fetchData = async () => {
      if (!tenantId) return;
      setLoading(true);

      try {
        // 🔄 Sync latest data to backend DB
        await syncData("customers", tenantId);
        await syncData("orders", tenantId);
        await syncData("products", tenantId);

        // ✅ Now fetch synced data from backend
        const [ordersData, customersData, productsData] = await Promise.all([
          getOrders(tenantId),
          getCustomers(tenantId),
          getProducts(tenantId),
        ]);

        setOrders(ordersData || []);
        setCustomers(customersData || []);
        setProducts(productsData || []);
      } catch (err) {
        console.error("Error during sync/fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenantId]);

  // Compute top customers
  useEffect(() => {
    if (!customers.length || !orders.length) {
      setCustomerStats([]);
      return;
    }

    const stats = customers.map((cust) => {
      // ✅ Correctly match orders using customer.id or customer.email
      const custOrders = orders.filter(
        (o) =>
          (o.customer?.id && o.customer.id === cust.customerId) ||
          o.customer?.email === cust.email ||
          o.email === cust.email
      );

      const totalSpent = custOrders.reduce(
        (acc, o) => acc + parseFloat(o.total_price || o.totalPrice || 0),
        0
      );

      return {
        name: `${cust.first_name || ""} ${cust.last_name || ""}`.trim(),
        email: cust.email,
        orderCount: custOrders.length,
        totalSpent,
      };
    });

    stats.sort((a, b) => b.totalSpent - a.totalSpent);
    setCustomerStats(stats.slice(0, 5));
  }, [customers, orders]);

  const totalRevenue = orders.reduce(
    (acc, o) => acc + parseFloat(o.total_price || o.totalPrice || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Syncing data, please wait...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-indigo-50 via-purple-50 to-white min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Header />

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md mx-8 mt-6 p-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back 👋</h1>
            <p className="text-sm opacity-80">
              Here’s your store performance today
            </p>
          </div>
        </div>

        <main className="p-8">
          {/* Overview Section */}
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Total Customers"
              value={customers.length}
              icon={<Users className="text-indigo-600" size={28} />}
            />
            <MetricCard
              title="Total Orders"
              value={orders.length}
              icon={<ShoppingBag className="text-purple-600" size={28} />}
            />
            <MetricCard
              title="Total Revenue"
              value={`$${totalRevenue.toFixed(2)}`}
              icon={<DollarSign className="text-emerald-600" size={28} />}
            />
          </div>

          {/* Analytics Section */}
          <h2 className="text-lg font-semibold text-gray-700 mt-10 mb-4">
            Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
              <h3 className="text-md font-semibold mb-4">📊 Orders Trend</h3>
              <OrdersChart orders={orders} />
            </div>
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
              <h3 className="text-md font-semibold mb-4">👥 Top Customers</h3>
              <TopCustomers customers={customerStats} />
            </div>
          </div>

          {/* Products Section */}
          <h2 className="text-lg font-semibold text-gray-700 mt-10 mb-4">
            Products
          </h2>
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
            {products.length === 0 ? (
              <p className="text-gray-500">No products found.</p>
            ) : (
              <ul className="divide-y">
                {products.map((p, i) => (
                  <li
                    key={i}
                    className="py-3 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="text-gray-400" />
                      <span className="font-medium">{p.title || p.name}</span>
                    </div>
                    <span className="text-gray-700 font-semibold">
                      $
                      {parseFloat(p.price || p.variants?.[0]?.price || 0).toFixed(
                        2
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
