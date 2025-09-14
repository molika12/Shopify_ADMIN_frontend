
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
  
  localStorage.removeItem("tenantId");
  localStorage.removeItem("tenantName");
 
  navigate("/login");
};


  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
     ${isActive ? "bg-green-600 text-white shadow" : "text-gray-700 hover:bg-gray-200"}`;

  return (
    <aside className="w-64 bg-white shadow-xl min-h-screen flex flex-col">
   
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-green-600">Shopify Admin</h1>
      </div>

  
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/dashboard" className={linkClasses}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/customers" className={linkClasses}>
          <Users size={20} />
          Customers
        </NavLink>
        <NavLink to="/orders" className={linkClasses}>
          <ShoppingBag size={20} />
          Orders
        </NavLink>
        <NavLink to="/products" className={linkClasses}>
          <Package size={20} />
          Products
        </NavLink>
        <NavLink to="/settings" className={linkClasses}>
          <Settings size={20} />
          Settings
        </NavLink>
      </nav>

   
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-all duration-200 w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

