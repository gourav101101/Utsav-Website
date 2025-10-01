import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { NavLink } from 'react-router-dom';

const AdminLayout: React.FC = ({ children }) => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
        <div className="md:hidden bg-white rounded shadow p-2 mb-4">
          <div className="flex justify-around">
            <NavLink to="/admin" end className={({ isActive }) => `text-center text-sm px-2 py-2 rounded ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => `text-center text-sm px-2 py-2 rounded ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
              Products
            </NavLink>
            <NavLink to="/admin/categories" className={({ isActive }) => `text-center text-sm px-2 py-2 rounded ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
              Categories
            </NavLink>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
