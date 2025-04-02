import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../types/api-responses';
import { isTokenExpired, getUserInfoFromToken, removeTokens } from '../../utils/token-manager';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; role: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // For development fallback
  const [mockAuth, setMockAuth] = useState(false);
  
  useEffect(() => {
    const initAuth = () => {
      // Check local tokens first
      if (!isTokenExpired()) {
        const userInfo = getUserInfoFromToken();
        if (userInfo) {
          setUser(userInfo);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }
      
      // Fallback to mock auth during development
      if (mockAuth) {
        setUser({ username: 'admin', role: 'ADMIN' });
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      
      // Not authenticated
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    };
    
    initAuth();
  }, [mockAuth]);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // First try to authenticate with the API
      const response = await AuthService.login(username, password);
      
      if (response.status === 'SUCCESS' && response.data) {
        const userInfo = getUserInfoFromToken();
        if (userInfo) {
          setUser(userInfo);
          setIsAuthenticated(true);
          return true;
        }
      }
      
      // If API authentication fails, try fallback for development
      if (process.env.NODE_ENV === 'development' && 
          username === 'admin' && 
          password === 'admin') {
        console.log('Using mock authentication for development');
        setMockAuth(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback for development if API is not available
      if (process.env.NODE_ENV === 'development' && 
          username === 'admin' && 
          password === 'admin') {
        console.log('API error - falling back to mock authentication');
        setMockAuth(true);
        return true;
      }
      
      return false;
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      if (mockAuth) {
        setMockAuth(false);
      } else {
        await AuthService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}; 