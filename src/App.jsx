import { Routes, Route, Navigate } from 'react-router-dom'; 
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
      <Route path="/" element={<Navigate to="/login" />} /> 
      <Route path="/login" element={<LoginPage />} />
       <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
   
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
