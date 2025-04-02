import api from '../utils/axios-config';
import { ApiResponse } from '../types/api-responses';
import { getToken } from '../utils/token-manager';
import { requiresAuthentication } from '../utils/api-helpers';

export class ApiService {
  /**
   * Adds authentication token to request headers if required
   * @param url API endpoint
   * @returns Config object with headers
   */
  private static getConfig(url: string) {
    const config: any = {};
    
    if (requiresAuthentication(url)) {
      const token = getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        };
      }
    }
    
    return config;
  }

  static async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const config = this.getConfig(url);
    if (params) {
      config.params = params;
    }
    
    const response = await api.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  static async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const config = this.getConfig(url);
    const response = await api.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  static async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const config = this.getConfig(url);
    const response = await api.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  static async delete<T>(url: string): Promise<ApiResponse<T>> {
    const config = this.getConfig(url);
    const response = await api.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  static async uploadFile<T>(
    url: string, 
    file: File, 
    additionalData?: Record<string, any>,
    parameterName: string = 'file'
  ): Promise<ApiResponse<T>> {
    try {
      console.log('ApiService: Uploading file', file.name, 'size:', file.size, 'with parameter name:', parameterName);
      
      const formData = new FormData();
      formData.append(parameterName, file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }
      
      // For file uploads, we need to let the browser set the Content-Type with boundary
      const config = this.getConfig(url);
      
      // Explicitly remove Content-Type so browser can set it with correct boundary
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
      
      console.log('ApiService: Upload config:', { ...config, body: 'FormData' });
      
      const response = await api.post<ApiResponse<T>>(url, formData, config);
      console.log('ApiService: Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('ApiService: File upload error:', error);
      throw error;
    }
  }
} 