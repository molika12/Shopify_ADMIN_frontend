
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginTenant } from "../api/shopify";

import syncData from "../api/syncData";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginTenant(email, password);

      if (res.success) {
      
        const tenant = res.tenant;

        const tenantId = tenant._id;
        const tenantName = tenant.name;
        const shopDomain = tenant.shopDomain;
        const accessToken = tenant.accessToken;

        localStorage.setItem("tenantId", tenantId);
        localStorage.setItem("tenantName", tenantName);
        localStorage.setItem("shopDomain", shopDomain);
        localStorage.setItem("accessToken", accessToken);
        if (res.token) localStorage.setItem("token", res.token);

        alert("Login successful! Syncing data...");

        await syncData("customers", shopDomain, accessToken);
        await syncData("orders", shopDomain, accessToken);
        await syncData("products", shopDomain, accessToken);

        alert("Data synced successfully!");
        navigate("/dashboard");
      } else {
        alert(res.message || "Login failed");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Log in to manage your Shopify store
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Don’t have an account?{" "}
          <button
            type="button"
            className="text-green-600 font-medium underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

