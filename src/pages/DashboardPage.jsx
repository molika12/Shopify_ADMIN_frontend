import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MetricCard } from "../components/MetricCard";
import { TopCustomers } from "../components/TopCustomers";
import { getOrders, getCustomers, getProducts } from "../api/shopify";
import syncData from "../api/syncData";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
} from "lucide-react";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const tenantId = localStorage.getItem("tenantId");
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerStats, setCustomerStats] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchData = async () => {
      if (!tenantId) return;
      setLoading(true);

      try {
        await Promise.all([
          syncData("customers", tenantId),
          syncData("orders", tenantId),
          syncData("products", tenantId),
        ]);

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

  
  useEffect(() => {
    if (!customers.length || !orders.length) {
      setCustomerStats([]);
      return;
    }

    const stats = customers.map((cust) => {
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

 
  const topProducts = products
    .map((p) => {
      const relatedOrders = orders.filter((o) =>
        o.line_items?.some((item) => item.product_id === p.id)
      );
      const totalSold = relatedOrders.reduce(
        (acc, o) =>
          acc +
          o.line_items
            ?.filter((item) => item.product_id === p.id)
            .reduce((sum, item) => sum + item.quantity, 0),
        0
      );
      return {
        title: p.title || p.name,
        price: parseFloat(p.price || p.variants?.[0]?.price || 0),
        sold: totalSold,
        revenue: totalSold * parseFloat(p.price || p.variants?.[0]?.price || 0),
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

 
  const customerChartData = customerStats.map((c) => ({
    name: c.name,
    totalSpent: c.totalSpent,
  }));

  
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
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 via-purple-50 to-white min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Header />

       
<div className="bg-yellow-500 text-white rounded-xl shadow-md mx-4 md:mx-8 mt-6 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back </h1>
            <p className="text-sm opacity-80">
              Here’s your store performance today
            </p>
          </div>
        </div>

        <main className="p-4 md:p-8">
       
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
             value={`₹${totalRevenue.toFixed(2)}`}

              icon={<DollarSign className="text-emerald-600" size={28} />}
            />
            <MetricCard
              title="Growth Rate"
              value="+12%"
              icon={<TrendingUp className="text-pink-600" size={28} />}
            />
          </div>

        
          <h2 className="text-lg font-semibold text-gray-700 mt-10 mb-4">
            Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
              <h3 className="text-md font-semibold mb-4">Top Customers by Spending</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                  <Bar dataKey="totalSpent" fill="#7c3aed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
              <h3 className="text-md font-semibold mb-4">Top Customers</h3>
              <TopCustomers customers={customerStats} />
            </div>
          </div>

         
          <h2 className="text-lg font-semibold text-gray-700 mt-10 mb-4">
            Recent Orders
          </h2>
          <div className="bg-white rounded-xl shadow p-6">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500">No recent orders.</p>
            ) : (
              <ul className="divide-y">
                {recentOrders.map((o, i) => (
                  <li
                    key={i}
                    className="py-3 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {o.customer?.first_name} {o.customer?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{o.created_at}</p>
                      </div>
                    </div>
                   <span className="text-gray-700 font-semibold">
                            ₹{parseFloat(o.total_price || 0).toFixed(2)}
                          </span>

                  </li>
                ))}
              </ul>
            )}
          </div>

        
          <h2 className="text-lg font-semibold text-gray-700 mt-10 mb-4">
            Top Products
          </h2>
          <div className="bg-white rounded-xl shadow p-6">
            {topProducts.length === 0 ? (
              <p className="text-gray-500">No product sales yet.</p>
            ) : (
              <ul className="divide-y">
                {topProducts.map((p, i) => (
                  <li
                    key={i}
                    className="py-3 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="text-gray-400" />
                      <span className="font-medium">{p.title}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-700 font-semibold">
                            ₹{p.revenue.toFixed(2)}
                          </p>

                          <p className="text-xs text-gray-500">
                            {p.sold} sold @ ₹{p.price}
                          </p>

                    </div>
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
