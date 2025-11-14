import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/layout/ErrorBoundary';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
          <BrowserRouter>
            <Header />
            <main className="container mx-auto px-4 py-6 flex-1">
            <Routes>
              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route path="/activities" element={<ErrorBoundary><Activities /></ErrorBoundary>} />
              <Route path="/activities/:id" element={<ErrorBoundary><ActivityDetail /></ErrorBoundary>} />
              <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
              <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;