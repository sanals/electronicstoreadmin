import { ApiResponse } from '../types/api-responses';
import { User } from '../types/user.types';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { apiFetch } from '../utils/api-fetch';
import { ApiService } from './api.service';

export class UserService {
  /**
   * Get all users with admin access
   * @returns Promise with array of users
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      // Try direct API call with apiFetch
      const response = await apiFetch(API_ENDPOINTS.USERS, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      
      const data: ApiResponse<User[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Fallback to proxy API call
      const response = await ApiService.get<User[]>(API_ENDPOINTS.USERS);
      return response.data;
    }
  }
  
  /**
   * Get a user by ID
   * @param id - User ID
   * @returns Promise with user data
   */
  static async getUserById(id: number): Promise<ApiResponse<User>> {
    return await ApiService.get<User>(API_ENDPOINTS.USER_BY_ID(id));
  }
  
  /**
   * Create a new admin user
   * @param userData User data to create
   * @returns Promise with created user
   */
  static async createUser(userData: Partial<User>): Promise<User> {
    try {
      // Try direct API call with apiFetch
      const response = await apiFetch(API_ENDPOINTS.CREATE_USER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`Error creating user: ${response.statusText}`);
      }
      
      const data: ApiResponse<User> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Fallback to proxy API call
      const response = await ApiService.post<User>(API_ENDPOINTS.CREATE_USER, userData);
      return response.data;
    }
  }
  
  /**
   * Update user status (active/inactive)
   * @param userId User ID to update
   * @param status New status
   * @returns Promise with updated user
   */
  static async updateUserStatus(userId: number, status: 'ACTIVE' | 'INACTIVE'): Promise<User> {
    try {
      // Try direct API call with apiFetch
      const url = `${API_ENDPOINTS.USERS}/${userId}/status`;
      const response = await apiFetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error(`Error updating user status: ${response.statusText}`);
      }
      
      const data: ApiResponse<User> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      
      // Fallback to proxy API call
      const url = `${API_ENDPOINTS.USERS}/${userId}/status`;
      const response = await ApiService.put<User>(url, { status });
      return response.data;
    }
  }
} 