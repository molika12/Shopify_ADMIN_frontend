import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { getCustomers } from "../api/shopify";
import { User, X } from "lucide-react";

export default function CustomersPage() {
  const tenantId = localStorage.getItem("tenantId");
  console.log("Tenant ID from localStorage:", tenantId); // <-- ADD THIS LINE
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    if (!tenantId) return;

    async function fetchCustomers() {
      try {
        const data = await getCustomers(tenantId);
        setCustomers(data || []);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setCustomers([]);
      }
    }

    fetchCustomers();
  }, [tenantId]);

  const filteredCustomers = customers.filter((c) =>
    (c.first_name || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (c.last_name || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Customers</h2>
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-64"
            />
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600">Name</th>
                  <th className="text-left px-6 py-3 text-gray-600">Email</th>
                  <th className="text-left px-6 py-3 text-gray-600">Phone</th>
                  <th className="text-right px-6 py-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{c.first_name || ""} {c.last_name || ""}</span>
                      </td>
                      <td className="px-6 py-4">{c.email || "N/A"}</td>
                      <td className="px-6 py-4">{c.phone || "N/A"}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => setSelectedCustomer(c)}
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

          {selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <X size={20} />
                </button>
                <h3 className="text-lg font-bold mb-4">Customer Details</h3>
                <p><strong>Name:</strong> {selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phone || "N/A"}</p>
                <p><strong>Tags:</strong> {selectedCustomer.tags || "N/A"}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
