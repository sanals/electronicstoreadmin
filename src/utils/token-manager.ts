import jwtDecode from 'jwt-decode';

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
  iat: number;
}

/**
 * Token management utilities for storing and retrieving JWT tokens
 */

// Key names for local storage
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Save both the JWT token and refresh token to storage
 * @param token The JWT token
 * @param refreshToken The refresh token
 */
export const saveTokens = (token: string, refreshToken: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Get the current JWT token from storage
 * @returns The JWT token or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the current refresh token from storage
 * @returns The refresh token or null if not found
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Remove both tokens from storage (used for logout)
 */
export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Alias for removeTokens to maintain backward compatibility
 * @deprecated Use removeTokens instead
 */
export const clearTokens = removeTokens;

/**
 * Check if the user is authenticated (has a token)
 * @returns True if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const getUserInfoFromToken = (): { username: string; role: string } | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      username: decoded.sub,
      role: decoded.role
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}; 