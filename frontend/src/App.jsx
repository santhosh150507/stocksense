import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Receipts from './pages/Receipts';
import ReceiptDetail from './pages/ReceiptDetail';
import Deliveries from './pages/Deliveries';
import DeliveryDetail from './pages/DeliveryDetail';
import Transfers from './pages/Transfers';
import Adjustments from './pages/Adjustments';
import Ledger from './pages/Ledger';
import Warehouses from './pages/Warehouses';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        className: 'text-sm font-medium rounded-lg shadow-lg border border-gray-100',
        success: { iconTheme: { primary: '#4f46e5', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/receipts/:id" element={<ReceiptDetail />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/deliveries/:id" element={<DeliveryDetail />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/adjustments" element={<Adjustments />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/settings/warehouses" element={<Warehouses />} />
          <Route path="/settings/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
