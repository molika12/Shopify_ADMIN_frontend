import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { getProducts } from "../api/shopify";

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

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-64"
            />
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  {p.image?.src ? (
                    <img
                      src={p.image.src}
                      alt={p.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{p.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">Category: {p.product_type || "N/A"}</p>
                    <p className="text-gray-700 font-medium mb-1">Price: ${parseFloat(p.variants?.[0]?.price || 0).toFixed(2)}</p>
                    <p className="text-gray-700 font-medium">Stock: {p.variants?.[0]?.inventory_quantity ?? "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
