import { Routes, Route, Navigate } from 'react-router-dom'; // ✅ add Navigate
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import SettingsPage from "./pages/SettingsPage";
import CustomersPage from "./pages/CustomersPage";
import SignupPage from './pages/SignupPage';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect / to /login */}
      <Route path="/login" element={<LoginPage />} />
       <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Optionally, a 404 page */}
        <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
