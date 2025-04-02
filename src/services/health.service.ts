import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiResponse } from '../types/api-responses';
import { apiFetch } from '../utils/api-fetch';

// Define base URL for direct API calls
const DIRECT_API_BASE_URL = 'http://localhost:8090';

export interface HealthStatus {
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  components: {
    [key: string]: {
      status: 'UP' | 'DOWN' | 'UNKNOWN';
      details?: Record<string, any>;
    }
  };
}

export interface HealthInfo {
  version: string;
  buildTime: string;
  environment: string;
  serverTime: string;
  uptime: string;
  memory: {
    free: string;
    total: string;
    max: string;
    used: string;
  };
}

export class HealthService {
  /**
   * Get basic health status directly from the backend
   * @returns Promise with health status
   */
  static async getHealthStatus(): Promise<ApiResponse<HealthStatus>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.HEALTH);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for health status');
      return await ApiService.get<HealthStatus>(API_ENDPOINTS.HEALTH);
    }
  }
  
  /**
   * Get detailed health information directly from the backend
   * @returns Promise with health info
   */
  static async getHealthInfo(): Promise<ApiResponse<HealthInfo>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.HEALTH_INFO);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health info API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for health info');
      return await ApiService.get<HealthInfo>(API_ENDPOINTS.HEALTH_INFO);
    }
  }
} 