import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { getProducts } from "../api/shopify";
import axios from "axios";

export default function ProductsPage() {
  const tenantId = localStorage.getItem("tenantId");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (tenantId) {
      getProducts(tenantId)
        .then((res) => setProducts(res || []))
        .catch((err) => {
          console.error("Error fetching products:", err);
          setProducts([]);
        });
    }
  }, [tenantId]);

  const filteredProducts = products.filter((p) =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.id && p.id.toString().includes(search))
  );

  // Delete product
  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/shopify/products/${productId}`);
      // Remove from state
      setProducts(products.filter((p) => p.id !== productId));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  // Edit product (navigate to edit page)
  const handleEdit = (productId) => {
    // You can navigate using react-router-dom or open a modal
    window.location.href = `/products/edit/${productId}`;
  };

  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Products</h2>
            <input
              type="text"
              placeholder="Search products..."
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
                  <th className="text-left px-6 py-3 text-gray-600">Price</th>
                  <th className="text-left px-6 py-3 text-gray-600">Stock</th>
                  <th className="text-right px-6 py-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{p.title}</td>
                      <td className="px-6 py-4">${parseFloat(p.variants?.[0]?.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">{p.variants?.[0]?.inventory_quantity ?? "N/A"}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => handleEdit(p.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
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
    </div>
  );
}
