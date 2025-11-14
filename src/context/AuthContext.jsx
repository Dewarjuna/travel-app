import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { authService } from '../api/services/authService';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const initializeAuth = async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      try {
        const response = await authService.me();
        setUser(response.data || null);
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  };
  useEffect(() => {initializeAuth();}, []);

  const register = async (data) => {
    const result = await authService.register(data);
    return result;
  };

  const login = useCallback(async (email, password) => {
    const result = await authService.login({ email, password });
    
    if (result?.token) {
      localStorage.setItem('token', result.token);
      setToken(result.token);
      setUser(result.data);
    }
    
    return result;}, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }}, []);

  const isAuthenticated = !!token;

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      register,
      login,
      logout,
    }), [user, token, loading, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};