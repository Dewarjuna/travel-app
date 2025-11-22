import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ErrorBoundary from './components/layout/ErrorBoundary';

// User pages
import Home from './pages/Home';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import ActivityManagement from './pages/admin/ActivityManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import BannerManagement from './pages/admin/BannerManagement';
import PromoManagement from './pages/admin/PromoManagement';
import UserManagement from './pages/admin/UserManagement';
import TransactionManagement from './pages/admin/TransactionManagement';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* User Routes with UserLayout */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route path="/activities" element={<ErrorBoundary><Activities /></ErrorBoundary>} />
              <Route path="/activities/:id" element={<ErrorBoundary><ActivityDetail /></ErrorBoundary>} />
              <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
              <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
              
              {/* Protected User Routes */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <ErrorBoundary><Cart /></ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <ErrorBoundary><Transactions /></ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ErrorBoundary><Profile /></ErrorBoundary>
                </ProtectedRoute>
              } />
            </Route>

            {/* Admin Routes with AdminLayout */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
              <Route path="activities" element={<ErrorBoundary><ActivityManagement /></ErrorBoundary>} />
              <Route path="categories" element={<ErrorBoundary><CategoryManagement /></ErrorBoundary>} />
              <Route path="banners" element={<ErrorBoundary><BannerManagement /></ErrorBoundary>} />
              <Route path="promos" element={<ErrorBoundary><PromoManagement /></ErrorBoundary>} />
              <Route path="users" element={<ErrorBoundary><UserManagement /></ErrorBoundary>} />
              <Route path="transactions" element={<ErrorBoundary><TransactionManagement /></ErrorBoundary>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;