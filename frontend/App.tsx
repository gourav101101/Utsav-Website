import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ContactUsPage from './pages/ContactUsPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import WhatsAppButton from './components/WhatsAppButton';
import { WHATSAPP_NUMBER } from './constants';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminCategories from './components/admin/AdminCategories';

const AppContent: React.FC = () => {
  const location = useLocation();
  // Hide header/footer/whatsapp on admin routes (login + panel)
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Ensure we scroll to top when the route changes so header is visible
  React.useEffect(() => {
    try {
      if (!isAdminRoute) window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (e) {
      // ignore in environments that disallow scrolling
    }
  }, [location.pathname, isAdminRoute]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-800">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/service/:id" element={<ServiceDetailPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={(sessionStorage.getItem('UTSAV_ADMIN_KEY')) ? <AdminPanel /> : <AdminLogin />}>
            {/* Default admin route */}
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton phoneNumber={WHATSAPP_NUMBER} />}
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;