import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
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
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import { useAuth } from './hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path="/receipts" element={<PrivateRoute><Receipts /></PrivateRoute>} />
      <Route path="/receipts/:id" element={<PrivateRoute><ReceiptDetail /></PrivateRoute>} />
      <Route path="/deliveries" element={<PrivateRoute><Deliveries /></PrivateRoute>} />
      <Route path="/deliveries/:id" element={<PrivateRoute><DeliveryDetail /></PrivateRoute>} />
      <Route path="/transfers" element={<PrivateRoute><Transfers /></PrivateRoute>} />
      <Route path="/adjustments" element={<PrivateRoute><Adjustments /></PrivateRoute>} />
      <Route path="/ledger" element={<PrivateRoute><Ledger /></PrivateRoute>} />
      <Route path="/warehouses" element={<PrivateRoute><Warehouses /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
