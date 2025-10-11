/**
 * useAsync Hook
 * Generic hook for managing async operations with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import { AsyncState } from '../types/helpers';

interface UseAsyncOptions<T> {
  immediate?: boolean;
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAsyncOptions<T> = {}
) => {
  const { immediate = true, initialData = null, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      onError?.(errorMessage);
      throw error;
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset: () => setState({ data: initialData, loading: false, error: null }),
  };
};

/**
 * useLazyAsync Hook
 * Like useAsync but doesn't execute immediately
 */
export const useLazyAsync = <T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) => {
  return useAsync(asyncFunction, [], { ...options, immediate: false });
};

export default useAsync;
