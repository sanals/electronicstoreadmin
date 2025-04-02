import { getToken } from './token-manager';
import { requiresAuthentication } from './api-helpers';

// Define base URL for direct API calls
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090';

/**
 * Make an authenticated API request to the backend
 * Automatically adds authentication token for endpoints that require it
 * 
 * @param endpoint The API endpoint to call
 * @param options Fetch options
 * @returns Promise with fetch response
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});
  
  // Don't set Content-Type for FormData (let browser handle it)
  const isFormData = options.body instanceof FormData;
  
  // Set default content type if not provided, method is not GET or DELETE, and not FormData
  if (!headers.has('Content-Type') && options.method && !['GET', 'DELETE'].includes(options.method) && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add authentication token if endpoint requires it
  if (requiresAuthentication(endpoint)) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      console.log(`Adding auth token to request: ${endpoint}`);
    } else {
      console.warn(`Endpoint ${endpoint} requires authentication but no token is available`);
    }
  }
  
  // Create the final request options
  const requestOptions: RequestInit = {
    ...options,
    headers
  };
  
  // Log the full request details
  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  console.log('Request Headers:', Object.fromEntries(headers.entries()));
  if (requestOptions.body) {
    try {
      // Try to log the body if it's JSON
      if (typeof requestOptions.body === 'string') {
        console.log('Request Body:', JSON.parse(requestOptions.body));
      } else if (requestOptions.body instanceof FormData) {
        console.log('Request Body: FormData with:', isFormData ? 'FormData (file upload)' : 'unknown');
      } else {
        console.log('Request Body:', requestOptions.body);
      }
    } catch (e) {
      console.log('Request Body: (could not parse)');
    }
  }
  
  try {
    // Make the request with the updated headers
    const response = await fetch(url, requestOptions);
    
    // Log response info
    console.log(`API Response: ${response.status} ${response.statusText} from ${url}`);
    
    // Clone the response for debugging if needed
    if (!response.ok) {
      try {
        const errorClone = response.clone();
        const errorBody = await errorClone.text();
        console.error('API Error Response Body:', errorBody);
      } catch (e) {
        console.error('Failed to read error response body');
      }
    }
    
    return response;
  } catch (error) {
    console.error(`API Request to ${url} failed:`, error);
    throw error;
  }
}; 