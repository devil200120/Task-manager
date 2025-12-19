import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiClient } from '../lib/api';
import { socketClient } from '../lib/socket';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (name: string) => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const response = await apiClient.getMe();
    if (response.success && response.data) {
      setUser(response.data.user);
      // Connect to Socket.io
      socketClient.connect(token);
    } else {
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password });
    
    if (response.success && response.data) {
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      // Connect to Socket.io
      socketClient.connect(response.data.token);
      return { success: true };
    }
    
    return { 
      success: false, 
      message: response.message || 'Login failed' 
    };
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await apiClient.register({ name, email, password });
    
    if (response.success && response.data) {
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      // Connect to Socket.io
      socketClient.connect(response.data.token);
      return { success: true };
    }
    
    return { 
      success: false, 
      message: response.message || 'Registration failed' 
    };
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    localStorage.removeItem('token');
    socketClient.disconnect();
  };

  const updateUser = async (name: string, email?: string) => {
    const response = await apiClient.updateProfile({ name, email: email || user?.email || '' });
    if (response.success && response.data) {
      setUser(response.data.user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
