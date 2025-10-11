/**
 * API Helper
 * Centralized API utilities for better error handling and response formatting
 */

import { ApiResponse, ApiError } from '../types/helpers';
import { ERROR_MESSAGES } from '../constants';

/**
 * Create success response
 */
export const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  error: null,
  success: true,
});

/**
 * Create error response
 */
export const createErrorResponse = <T = null>(
  message: string,
  code?: string,
  details?: any
): ApiResponse<T> => ({
  data: null,
  error: {
    message,
    code,
    details,
  },
  success: false,
});

/**
 * Handle API error
 */
export const handleApiError = (error: any): ApiError => {
  // Supabase error
  if (error?.message) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  // Network error
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: ERROR_MESSAGES.NETWORK,
      code: 'NETWORK_ERROR',
    };
  }

  // Generic error
  return {
    message: ERROR_MESSAGES.GENERIC,
    code: 'UNKNOWN_ERROR',
    details: error,
  };
};

/**
 * Try-catch wrapper with response formatting
 */
export const tryCatch = async <T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<ApiResponse<T>> => {
  try {
    const data = await fn();
    return createSuccessResponse(data);
  } catch (error) {
    console.error('API Error:', error);
    const apiError = handleApiError(error);
    return createErrorResponse(
      errorMessage || apiError.message,
      apiError.code,
      apiError.details
    );
  }
};

/**
 * Retry function with exponential backoff
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
      }
    }
  }

  throw lastError;
};

/**
 * Timeout wrapper
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Request timeout'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
};

/**
 * Batch requests
 */
export const batchRequests = async <T>(
  requests: Array<() => Promise<T>>,
  batchSize: number = 5
): Promise<T[]> => {
  const results: T[] = [];

  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(req => req()));
    results.push(...batchResults);
  }

  return results;
};

/**
 * Parse query parameters
 */
export const parseQueryParams = (params: Record<string, any>): URLSearchParams => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });

  return searchParams;
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: any): boolean => {
  return (
    error instanceof TypeError &&
    (error.message.includes('fetch') || error.message.includes('network'))
  );
};

/**
 * Check if error is timeout error
 */
export const isTimeoutError = (error: any): boolean => {
  return error?.message?.includes('timeout') || error?.code === 'TIMEOUT';
};

/**
 * Check if error is auth error
 */
export const isAuthError = (error: any): boolean => {
  return (
    error?.code === 'UNAUTHORIZED' ||
    error?.status === 401 ||
    error?.message?.toLowerCase().includes('unauthorized')
  );
};

/**
 * Format API error for display
 */
export const formatErrorMessage = (error: ApiError | null): string => {
  if (!error) return '';
  
  // Use custom error message if available
  if (error.message) return error.message;
  
  // Fallback to generic error
  return ERROR_MESSAGES.GENERIC;
};

/**
 * Log API call (development only)
 */
export const logApiCall = (method: string, endpoint: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.group(`🔌 API Call: ${method} ${endpoint}`);
    if (data) console.log('Data:', data);
    console.groupEnd();
  }
};

/**
 * Log API response (development only)
 */
export const logApiResponse = (endpoint: string, response: any, duration?: number) => {
  if (import.meta.env.DEV) {
    console.group(`✅ API Response: ${endpoint}`);
    console.log('Response:', response);
    if (duration) console.log('Duration:', `${duration}ms`);
    console.groupEnd();
  }
};

/**
 * Log API error (development only)
 */
export const logApiError = (endpoint: string, error: any) => {
  if (import.meta.env.DEV) {
    console.group(`❌ API Error: ${endpoint}`);
    console.error('Error:', error);
    console.groupEnd();
  }
};

export default {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  tryCatch,
  retry,
  withTimeout,
  batchRequests,
  parseQueryParams,
  isNetworkError,
  isTimeoutError,
  isAuthError,
  formatErrorMessage,
  logApiCall,
  logApiResponse,
  logApiError,
};
