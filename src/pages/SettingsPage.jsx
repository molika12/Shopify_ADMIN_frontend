import { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    // Save logic here (call backend API)
    alert(`Saved! Store Name: ${storeName}, Store Email: ${storeEmail}`);
  };

  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header />
        <main className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>
          <div className="bg-white rounded-xl shadow p-6 space-y-6">
            <p className="text-gray-600">
              Configure your store settings, payment options, shipping, and other preferences here.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter your store name"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Store Email</label>
                <input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter your store email"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Settings
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
