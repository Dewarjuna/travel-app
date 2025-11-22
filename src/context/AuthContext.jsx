import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { authService } from '../api/services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const initializeAuth = async () => {
    const savedToken = localStorage.getItem('token');
    
    // Only fetch user if token exists
    if (savedToken) {
      setToken(savedToken);
      try {
        const response = await authService.me();
        setUser(response.data || null);
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const register = async (data) => {
    const result = await authService.register(data);
    return result;
  };

  const login = useCallback(async (email, password) => {
    try {
      const result = await authService.login({ email, password });
      
      if (result?.token) {
        localStorage.setItem('token', result.token);
        setToken(result.token);
        setUser(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Only call logout API if token exists
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  }, [token]);

  const isAuthenticated = !!token && !!user;

  const isAdmin = useMemo(() => {
    return user?.role === 'admin';
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      register,
      login,
      logout,
    }),
    [user, token, loading, isAuthenticated, isAdmin, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};