import axios, { AxiosRequestHeaders } from 'axios';
import { refreshToken } from '../services/auth.service';
import { getToken, saveTokens, removeTokens } from './token-manager';

/**
 * Create an axios instance for API calls
 * Configured with interceptors for authentication and error handling
 */
const api = axios.create({
  baseURL: '', // Empty baseURL to use relative paths with proxy during development
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  config => {
    // Don't set Content-Type for FormData (let axios handle it)
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
    }
    
    // Add auth token if available
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`Axios Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await refreshToken();
        if (response && response.accessToken) {
          // Save the new tokens
          saveTokens(response.accessToken, response.refreshToken);
          
          // Update the Authorization header
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${response.accessToken}`;
          } else {
            originalRequest.headers = { 'Authorization': `Bearer ${response.accessToken}` } as AxiosRequestHeaders;
          }
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens and redirect to login
        removeTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 