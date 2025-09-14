// src/components/Header.jsx
import { Search, Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
       
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-gray-400"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-green-600">
          <Bell size={22} />
          
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          
          <span className="font-medium text-gray-700 hidden md:inline">
            Admin
          </span>
          <User size={18} className="text-gray-500 md:hidden" />
        </div>
      </div>
    </header>
  );
}
