import React from 'react';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  function logout() {
    sessionStorage.removeItem('UTSAV_ADMIN_KEY');
    navigate('/admin/login');
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Utsav Admin</h2>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-sm text-gray-600">Signed in as <strong>admin</strong></div>
            <button className="px-3 py-2 border rounded" onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Mobile tab bar for switching sections easily */}
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

        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
