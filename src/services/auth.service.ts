import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest,
  PasswordChangeRequest,
  PasswordResetRequest,
  ResetPasswordRequest,
  TokenRefreshRequest,
  TokenRefreshResponse
} from '../types/api-responses';
import { saveTokens, getRefreshToken, removeTokens } from '../utils/token-manager';
import { apiFetch } from '../utils/api-fetch';

// Direct API base URL - use environment variable or fallback to hardcoded value
const DIRECT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090';

export class AuthService {
  /**
   * Login with username and password
   * @param username Username
   * @param password Password
   * @returns Promise with auth response
   */
  static async login(username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      console.log('AuthService: Logging in with', username);
      const response = await apiFetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }
      
      const data: ApiResponse<AuthResponse> = await response.json();
      console.log('AuthService: Login response:', data);
      
      if (data.status === 'SUCCESS' && data.data) {
        // Save tokens to localStorage
        saveTokens(data.data.token, data.data.refreshToken);
        console.log('AuthService: Tokens saved successfully');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to proxy
      console.log('Falling back to proxy for login');
      const response = await ApiService.post<AuthResponse>(API_ENDPOINTS.LOGIN, { username, password });
      
      if (response.status === 'SUCCESS' && response.data) {
        // Save tokens to localStorage
        saveTokens(response.data.token, response.data.refreshToken);
        console.log('AuthService: Tokens saved successfully via proxy');
      }
      
      return response;
    }
  }
  
  /**
   * Logout the current user
   * @returns Promise with API response
   */
  static async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST'
      });
      
      // Clear tokens regardless of response
      removeTokens();
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear tokens anyway
      removeTokens();
      
      // Fallback to proxy
      return await ApiService.post<null>(API_ENDPOINTS.LOGOUT);
    }
  }
  
  /**
   * Refresh the access token using refresh token
   * @returns Promise with new tokens
   */
  static async refreshToken(): Promise<TokenRefreshResponse> {
    try {
      const refreshTokenValue = getRefreshToken();
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiFetch(API_ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        body: JSON.stringify({ refreshToken: refreshTokenValue })
      });
      
      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }
      
      const data: ApiResponse<TokenRefreshResponse> = await response.json();
      
      if (data.status === 'SUCCESS' && data.data) {
        return data.data;
      } else {
        throw new Error(data.message || 'Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
  
  /**
   * Change user password
   * @param currentPassword Current password
   * @param newPassword New password
   * @param confirmPassword Confirm new password
   * @returns Promise with API response
   */
  static async changePassword(
    currentPassword: string, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Change password error:', error);
      // Fallback to proxy
      return await ApiService.post<null>(API_ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword, 
        newPassword, 
        confirmPassword
      });
    }
  }
  
  /**
   * Request password reset email
   * @param email User email
   * @returns Promise with API response
   */
  static async forgotPassword(email: string): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      // Fallback to proxy
      return await ApiService.post<null>(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    }
  }
  
  /**
   * Reset password with token
   * @param token Reset token from email
   * @param newPassword New password
   * @param confirmPassword Confirm new password
   * @returns Promise with API response
   */
  static async resetPassword(
    token: string, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ token, newPassword, confirmPassword })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      // Fallback to proxy
      return await ApiService.post<null>(API_ENDPOINTS.RESET_PASSWORD, {
        token, 
        newPassword, 
        confirmPassword
      });
    }
  }
}

/**
 * Standalone function for refreshing access token
 * Used by axios interceptor
 */
export const refreshToken = async (): Promise<TokenRefreshResponse> => {
  return AuthService.refreshToken();
}; 