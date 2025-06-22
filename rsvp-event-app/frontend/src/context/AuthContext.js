import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if token exists and is valid
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Check if token is expired
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          logout();
          setLoading(false);
          return;
        }

        // Set auth token for API requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user data
        const { data } = await api.get('/api/auth/me');
        setUser(data.data);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        logout();
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login user
  const login = async (credentials) => {
    try {
      const loginData = {
        email: credentials.email,
        password: credentials.password
      };
      
      console.log('Connecting to backend server...');
      
      // Try direct fetch first to check connectivity
      try {
        await fetch('http://localhost:5010/health', { method: 'GET' });
        console.log('Backend health check successful');
      } catch (healthError) {
        console.error('Backend health check failed:', healthError);
        throw new Error('Cannot connect to backend server. Please ensure it is running.');
      }
      
      console.log('Sending login request with data:', loginData);
      
      // Use the standard login endpoint
      const { data } = await api.post('/api/auth/login', loginData);
      
      console.log('Login successful, received data:', data);
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('Login error details:', error.response?.data || error.message);
      throw error;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const { data } = await api.post('/api/auth/register', userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/api/users/profile', profileData);
      setUser(data.data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Handle password reset request
  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post('/api/auth/forgot-password', { email });
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Reset password with token
  const resetPassword = async (token, password) => {
    try {
      const { data } = await api.post(`/api/auth/reset-password/${token}`, { password });
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Check if user has permission to perform an action
  const hasPermission = (requiredRole) => {
    if (!user || !user.role) return false;
    
    if (user.role === 'admin') return true; // Admin has all permissions
    
    // Check if user role matches or is higher than required role
    const roles = ['guest', 'event_host', 'event_manager', 'admin'];
    const userRoleIndex = roles.indexOf(user.role);
    const requiredRoleIndex = roles.indexOf(requiredRole);
    
    return userRoleIndex >= requiredRoleIndex;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
