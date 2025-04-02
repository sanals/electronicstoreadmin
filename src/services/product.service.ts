import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { 
  ApiResponse, 
  Product, 
  ProductCreateRequest, 
  ProductUpdateRequest,
  ProductResponse,
  Category
} from '../types/api-responses';
import { apiFetch } from '../utils/api-fetch';

// Define base URL for direct API calls
const DIRECT_API_BASE_URL = 'http://localhost:8090';

/**
 * Paginated response from the API
 */
interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export class ProductService {
  /**
   * Get all products with proper authentication
   * @returns Promise with paginated list of products
   */
  static async getAllProducts(): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      console.log('ProductService: Calling getAllProducts API');
      const response = await apiFetch(API_ENDPOINTS.PRODUCTS);
      
      if (!response.ok) {
        console.error('ProductService: API returned error status:', response.status);
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('ProductService: API response data:', data);
      
      // Ensure data structure is correct
      if (!data || typeof data !== 'object') {
        console.error('ProductService: Invalid response data structure:', data);
        throw new Error('Invalid API response structure');
      }
      
      return data;
    } catch (error) {
      console.error('Products API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for products');
      return await ApiService.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS);
    }
  }
  
  /**
   * Get a product by ID with proper authentication
   * @param id - Product ID
   * @returns Promise with product data
   */
  static async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.PRODUCT_BY_ID(id));
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Product API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for product');
      return await ApiService.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
    }
  }
  
  /**
   * Create a new product with proper authentication
   * @param product - Product create request data
   * @returns Promise with created product data
   */
  static async createProduct(product: ProductCreateRequest): Promise<ApiResponse<Product>> {
    try {
      console.log('Creating product with data:', product);
      const response = await apiFetch(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Create product response:', data);
      return data;
    } catch (error) {
      console.error('Create product API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for create product');
      return await ApiService.post<Product>(API_ENDPOINTS.PRODUCTS, product);
    }
  }
  
  /**
   * Update an existing product with proper authentication
   * @param id - Product ID
   * @param product - Product update request data
   * @returns Promise with API response
   */
  static async updateProduct(id: number, product: ProductUpdateRequest): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.PRODUCT_BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(product),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update product API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for update product');
      return await ApiService.put<null>(API_ENDPOINTS.PRODUCT_BY_ID(id), product);
    }
  }
  
  /**
   * Delete a product with proper authentication
   * @param id - Product ID
   * @returns Promise with API response
   */
  static async deleteProduct(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.PRODUCT_BY_ID(id), {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete product API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for delete product');
      return await ApiService.delete<null>(API_ENDPOINTS.PRODUCT_BY_ID(id));
    }
  }
  
  /**
   * Upload a product image with proper authentication
   * @param file - Image file to upload
   * @param productId - Optional product ID to associate with
   * @returns Promise with uploaded image URLs
   */
  static async uploadProductImage(file: File, productId?: number): Promise<ApiResponse<string[]>> {
    try {
      console.log('Uploading image file:', file.name, 'size:', file.size);
      
      // Create FormData and append file
      const formData = new FormData();
      // Use 'images' as parameter name to match the backend controller
      formData.append('images', file);
      
      if (productId) {
        formData.append('productId', productId.toString());
      }
      
      // Use direct fetch to ensure correct Content-Type handling
      const response = await apiFetch(API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - the browser will set it with the correct boundary
        headers: {} 
      });
      
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Upload response data:', data);
      return data;
    } catch (error) {
      console.error('Upload image API call error:', error);
      
      // Try direct fallback with fetch API
      try {
        console.log('Trying direct fetch fallback for image upload');
        
        const formData = new FormData();
        // Use 'images' as parameter name to match the backend controller
        formData.append('images', file);
        
        if (productId) {
          formData.append('productId', productId.toString());
        }
        
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${DIRECT_API_BASE_URL}${API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE}`, {
          method: 'POST',
          body: formData,
          headers
        });
        
        const data = await response.json();
        console.log('Direct fetch upload response:', data);
        return data;
      } catch (fallbackError) {
        console.error('Direct fallback upload failed:', fallbackError);
        
        // Last resort - try API service
        console.log('Falling back to ApiService for upload image');
        const additionalData = productId ? { productId } : undefined;
        // Pass file with the correct parameter name
        return await ApiService.uploadFile<string[]>(
          API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE, 
          file, 
          additionalData,
          'images' // Parameter name to use for the file
        );
      }
    }
  }
  
  /**
   * Update product status with proper authentication
   * @param id - Product ID
   * @param status - New status
   * @returns Promise with API response
   */
  static async updateProductStatus(id: number, status: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.UPDATE_PRODUCT_STATUS(id), {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update product status API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for update product status');
      return await ApiService.put<null>(API_ENDPOINTS.UPDATE_PRODUCT_STATUS(id), { status });
    }
  }
  
  /**
   * Create product with images in a single API call
   * @param productData - Product data
   * @param imageFiles - Array of image files
   * @returns Promise with created product data
   */
  static async createProductWithImages(
    productData: ProductCreateRequest, 
    imageFiles: File[]
  ): Promise<ApiResponse<Product | null>> {
    try {
      console.log('Creating product with images:', productData, `(${imageFiles.length} images)`);
      
      // Create FormData and append product data
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description || '');
      formData.append('price', productData.price.toString());
      formData.append('stock', productData.stock.toString());
      formData.append('categoryId', productData.categoryId.toString());
      formData.append('specifications', productData.specifications || '{}');
      
      // Append all image files with the same field name 'images'
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await apiFetch(API_ENDPOINTS.CREATE_PRODUCT_WITH_IMAGES, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with the correct boundary
        headers: {}
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', response.status, errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      
      // Get response as text first
      const responseText = await response.text();
      
      try {
        // Try to parse the text as JSON
        const data = JSON.parse(responseText) as ApiResponse<ProductResponse>;
        console.log('Create product with images response:', data);
        
        // Return success with simplified data if status is SUCCESS
        if (data.status === 'SUCCESS' && data.data) {
          return {
            status: data.status,
            code: data.code,
            message: data.message,
            data: {
              id: data.data.id,
              name: data.data.name,
              description: data.data.description,
              price: data.data.price,
              category: {
                id: data.data.category?.id || productData.categoryId,
                name: data.data.category?.name || 'Unknown',
                description: data.data.category?.description || '',
                parentCategory: undefined,
                status: 'ACTIVE',
                createdAt: data.data.createdAt || '',
                updatedAt: data.data.updatedAt || '',
                createdBy: data.data.createdBy || '',
                lastModifiedBy: data.data.lastModifiedBy || ''
              },
              specifications: data.data.specifications,
              images: data.data.images || [],
              stock: data.data.stock,
              status: data.data.status || 'ACTIVE',
              createdAt: data.data.createdAt,
              updatedAt: data.data.updatedAt,
              createdBy: data.data.createdBy || '',
              lastModifiedBy: data.data.lastModifiedBy || ''
            },
            timestamp: data.timestamp
          };
        } else {
          return data as unknown as ApiResponse<Product | null>;
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // Return a simplified success response if we can't parse the JSON
        // This allows the UI to continue even with malformed JSON response
        if (response.status >= 200 && response.status < 300) {
          return {
            status: 'SUCCESS',
            code: response.status,
            message: 'Product created successfully (response parsing error)',
            data: {
              id: -1, // Placeholder ID
              name: productData.name,
              description: productData.description || '',
              price: productData.price,
              category: {
                id: productData.categoryId,
                name: 'Unknown',
                description: '',
                parentCategory: undefined,
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: '',
                lastModifiedBy: ''
              },
              specifications: productData.specifications || '{}',
              images: [],
              stock: productData.stock,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: '',
              lastModifiedBy: ''
            },
            timestamp: new Date().toISOString()
          };
        } else {
          throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
        }
      }
    } catch (error) {
      console.error('Create product with images API call error:', error);
      return {
        status: 'ERROR',
        code: 500,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Update product with images in a single API call
   * @param id - Product ID
   * @param productData - Product data
   * @param newImageFiles - Array of new image files to add
   * @returns Promise with updated product data
   */
  static async updateProductWithImages(
    id: number,
    productData: ProductUpdateRequest,
    newImageFiles: File[]
  ): Promise<ApiResponse<Product | null>> {
    try {
      console.log('Updating product with images:', id, productData, `(${newImageFiles.length} new images)`);
      
      // Create FormData and append product data
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description || '');
      formData.append('price', productData.price.toString());
      formData.append('stock', productData.stock.toString());
      formData.append('categoryId', productData.categoryId.toString());
      formData.append('specifications', productData.specifications || '{}');
      
      // Append existing image URLs if provided
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((url, index) => {
          formData.append(`existingImages[${index}]`, url);
        });
      }
      
      // Append all new image files with the same field name 'images'
      newImageFiles.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await apiFetch(API_ENDPOINTS.UPDATE_PRODUCT_WITH_IMAGES(id), {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header - browser will set it with the correct boundary
        headers: {}
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', response.status, errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      
      // Get response as text first
      const responseText = await response.text();
      
      try {
        // Try to parse the text as JSON
        const data = JSON.parse(responseText) as ApiResponse<ProductResponse>;
        console.log('Update product with images response:', data);
        
        // Return success with simplified data if status is SUCCESS
        if (data.status === 'SUCCESS' && data.data) {
          return {
            status: data.status,
            code: data.code,
            message: data.message,
            data: {
              id: data.data.id,
              name: data.data.name,
              description: data.data.description,
              price: data.data.price,
              category: {
                id: data.data.category?.id || productData.categoryId,
                name: data.data.category?.name || 'Unknown',
                description: data.data.category?.description || '',
                parentCategory: undefined,
                status: 'ACTIVE',
                createdAt: data.data.createdAt || '',
                updatedAt: data.data.updatedAt || '',
                createdBy: data.data.createdBy || '',
                lastModifiedBy: data.data.lastModifiedBy || ''
              },
              specifications: data.data.specifications,
              images: data.data.images || [],
              stock: data.data.stock,
              status: data.data.status || 'ACTIVE',
              createdAt: data.data.createdAt,
              updatedAt: data.data.updatedAt,
              createdBy: data.data.createdBy || '',
              lastModifiedBy: data.data.lastModifiedBy || ''
            },
            timestamp: data.timestamp
          };
        } else {
          return data as unknown as ApiResponse<Product | null>;
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // Return a simplified success response if we can't parse the JSON
        // This allows the UI to continue even with malformed JSON response
        if (response.status >= 200 && response.status < 300) {
          return {
            status: 'SUCCESS',
            code: response.status,
            message: 'Product updated successfully (response parsing error)',
            data: {
              id: id,
              name: productData.name,
              description: productData.description || '',
              price: productData.price,
              category: {
                id: productData.categoryId,
                name: 'Unknown',
                description: '',
                parentCategory: undefined,
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: '',
                lastModifiedBy: ''
              },
              specifications: productData.specifications || '{}',
              images: productData.images || [],
              stock: productData.stock,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: '',
              lastModifiedBy: ''
            },
            timestamp: new Date().toISOString()
          };
        } else {
          throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
        }
      }
    } catch (error) {
      console.error('Update product with images API call error:', error);
      return {
        status: 'ERROR',
        code: 500,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }
} 