import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { 
  ApiResponse, 
  Category, 
  CategoryCreateRequest, 
  CategoryUpdateRequest,
  CategoryResponse
} from '../types/api-responses';
import { apiFetch } from '../utils/api-fetch';

// Define base URL for direct API calls
const DIRECT_API_BASE_URL = 'http://localhost:8090';

export class CategoryService {
  /**
   * Get all categories with proper authentication
   * @returns Promise with list of categories
   */
  static async getAllCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CATEGORIES);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Categories API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for categories');
      return await ApiService.get<Category[]>(API_ENDPOINTS.CATEGORIES);
    }
  }
  
  /**
   * Get a category by ID with proper authentication
   * @param id - Category ID
   * @returns Promise with category data
   */
  static async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CATEGORY_BY_ID(id));
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Category API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for category');
      return await ApiService.get<Category>(API_ENDPOINTS.CATEGORY_BY_ID(id));
    }
  }
  
  /**
   * Create a new category with proper authentication
   * @param category - Category create request data
   * @returns Promise with created category ID
   */
  static async createCategory(category: CategoryCreateRequest): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CATEGORIES, {
        method: 'POST',
        body: JSON.stringify(category),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create category API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for create category');
      return await ApiService.post<CategoryResponse>(API_ENDPOINTS.CATEGORIES, category);
    }
  }
  
  /**
   * Update an existing category with proper authentication
   * @param id - Category ID
   * @param category - Category update request data
   * @returns Promise with API response
   */
  static async updateCategory(id: number, category: CategoryUpdateRequest): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CATEGORY_BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(category),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update category API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for update category');
      return await ApiService.put<null>(API_ENDPOINTS.CATEGORY_BY_ID(id), category);
    }
  }
  
  /**
   * Delete a category with proper authentication
   * @param id - Category ID
   * @returns Promise with API response
   */
  static async deleteCategory(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CATEGORY_BY_ID(id), {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete category API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for delete category');
      return await ApiService.delete<null>(API_ENDPOINTS.CATEGORY_BY_ID(id));
    }
  }

  /**
   * Create a new category with image
   * @param formData - FormData containing category data and image
   * @returns Promise with created category
   */
  static async createCategoryWithImage(formData: FormData): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await fetch(`${DIRECT_API_BASE_URL}${API_ENDPOINTS.CREATE_CATEGORY_WITH_IMAGE}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create category with image API call error:', error);
      throw error;
    }
  }

  /**
   * Update a category with image
   * @param id - Category ID
   * @param formData - FormData containing category data and image
   * @returns Promise with updated category
   */
  static async updateCategoryWithImage(id: number, formData: FormData): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await fetch(`${DIRECT_API_BASE_URL}${API_ENDPOINTS.UPDATE_CATEGORY_WITH_IMAGE(id)}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update category with image API call error:', error);
      throw error;
    }
  }
} 