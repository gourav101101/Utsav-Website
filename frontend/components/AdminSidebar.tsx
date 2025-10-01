import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Icon = ({ name }: { name: string }) => {
  const icons: { [key: string]: JSX.Element } = {
    dashboard: <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18"/></svg>,
    products: <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M3 7h18v13H3zM8 7V3h8v4"/></svg>,
    categories: <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>,
  };
  return icons[name] || null;
};

const AdminSidebar: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`;

  return (
    <aside className="w-72 bg-white border-r h-screen p-6 hidden md:block">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-white rounded flex items-center justify-center font-bold">U</div>
          <div>
            <div className="text-lg font-bold">Utsav Admin</div>
            <div className="text-sm text-gray-500">Manage products & categories</div>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        <NavLink to="/admin" className={navLinkClasses} end>
          <Icon name="dashboard"/> Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={navLinkClasses}>
          <Icon name="products"/> Products
        </NavLink>
        <NavLink to="/admin/categories" className={navLinkClasses}>
          <Icon name="categories"/> Categories
        </NavLink>
        
        <div className="border-t mt-6 pt-4">
          <div className="text-xs text-gray-500 mb-2">Account</div>
          <NavLink to="/admin/login" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Login</NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
