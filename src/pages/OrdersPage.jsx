import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { getOrders } from "../api/shopify";
import { Package, Calendar, X } from "lucide-react";

export default function OrdersPage() {
  const tenantId = localStorage.getItem("tenantId");
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!tenantId) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrders(tenantId);
        console.log("Orders fetched:", data);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [tenantId]);

  const filteredOrders = orders.filter(
    (o) =>
      o.customer?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toString().includes(search)
  );

  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Orders</h2>
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-64"
            />
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600">Order ID</th>
                  <th className="text-left px-6 py-3 text-gray-600">Customer</th>
                  <th className="text-left px-6 py-3 text-gray-600">Date</th>
                  <th className="text-left px-6 py-3 text-gray-600">Total</th>
                  <th className="text-left px-6 py-3 text-gray-600">Status</th>
                  <th className="text-right px-6 py-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{o.id}</td>
                      <td className="px-6 py-4 flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>
                          {o.customer
                            ? `${o.customer.first_name || ""} ${o.customer.last_name || ""}`
                            : "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {o.created_at
                            ? new Date(o.created_at).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">${o.total_price || "0"}</td>
                      <td className="px-6 py-4 capitalize">
                        {o.financial_status || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

    
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg w-1/2 p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">
              Order #{selectedOrder.id}
            </h2>
            <p>
              <strong>Customer:</strong>{" "}
              {selectedOrder.customer
                ? `${selectedOrder.customer.first_name} ${selectedOrder.customer.last_name}`
                : "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.customer?.email || "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {selectedOrder.created_at
                ? new Date(selectedOrder.created_at).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Total:</strong> ${selectedOrder.total_price || "0"}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.financial_status || "N/A"}
            </p>

            <h3 className="text-lg font-semibold mt-4">Line Items</h3>
            <ul className="list-disc ml-6">
              {selectedOrder.line_items?.map((item, i) => (
                <li key={i}>
                  {item.quantity} × {item.name} (${item.price})
                </li>
              )) || <li>No items found</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

