import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useAppDispatch';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import OrderManagement from './pages/orders/OrderManagement';
import KitchenDisplay from './pages/orders/KitchenDisplay';
import InventoryManagement from './pages/inventory/InventoryManagement';
import PaymentProcessing from './pages/payments/PaymentProcessing';
import TransactionHistory from './pages/payments/TransactionHistory';
import ReportingAnalytics from './pages/reports/ReportingAnalytics';
import UserManagement from './pages/users/UserManagement';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated } = useAppSelector(s => s.auth);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="kitchen" element={<KitchenDisplay />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="payments" element={<PaymentProcessing />} />
        <Route path="transactions" element={<TransactionHistory />} />
        <Route path="reports" element={<ReportingAnalytics />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
