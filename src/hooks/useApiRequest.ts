import { useState, useCallback } from 'react';
import { ApiResponse } from '../types/api-responses';
import { useNotification } from './useNotification';

interface UseApiRequestReturn<T, P extends any[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...params: P) => Promise<ApiResponse<T> | null>;
}

/**
 * Custom hook for handling API requests with loading and error states
 * @param requestFn - The API service function to call
 * @param showSuccessNotification - Whether to show a success notification
 * @param successMessage - Custom success message
 * @returns Object with data, loading, error, and execute function
 */
export function useApiRequest<T, P extends any[]>(
  requestFn: (...args: P) => Promise<ApiResponse<T>>,
  showSuccessNotification = false,
  successMessage = 'Operation completed successfully'
): UseApiRequestReturn<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const execute = useCallback(async (...params: P): Promise<ApiResponse<T> | null> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('useApiRequest: Executing request function', requestFn.name);
      const response = await requestFn(...params);
      console.log('useApiRequest: Raw API response:', response);
      
      if (!response) {
        throw new Error('No response received from API');
      }
      
      if (response.status === 'SUCCESS') {
        console.log('useApiRequest: Success data:', response.data);
        setData(response.data);
        if (showSuccessNotification) {
          showNotification(successMessage, 'success');
        }
        return response;
      } else {
        const errorMsg = response.message || 'An error occurred';
        console.error('useApiRequest: API returned error:', errorMsg);
        setError(errorMsg);
        showNotification(errorMsg, 'error');
        return response;
      }
    } catch (err) {
      console.error('useApiRequest: Exception caught:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [requestFn, showSuccessNotification, successMessage, showNotification]);

  return { data, loading, error, execute };
} 