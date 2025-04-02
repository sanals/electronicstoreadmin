import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/auth/Auth.context';
import { getUserInfoFromToken, isTokenExpired } from '../utils/token-manager';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export const useCurrentUser = () => {
  const [userInfo, setUserInfo] = useState<{ username: string; role: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAuth = () => {
      if (isTokenExpired()) {
        setIsAuthenticated(false);
        setUserInfo(null);
      } else {
        const user = getUserInfoFromToken();
        setUserInfo(user);
        setIsAuthenticated(!!user);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  return { userInfo, isAuthenticated, isLoading };
}; 