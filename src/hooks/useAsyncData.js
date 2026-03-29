import { useState, useEffect, useCallback, useRef } from 'react';

export function useAsyncData(fetchFunction, dependencies = [], options = {}) {
  const {
    immediate = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  const isFirstRender = useRef(true);

  const executeFetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();

      if (isMountedRef.current) {
        setData(result);
        setLoading(false);

        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
        setLoading(false);

        if (onError) {
          onError(err);
        }
      }
    }
  }, [fetchFunction, onSuccess, onError]);

  const refetch = useCallback(() => {
    return executeFetch();
  }, [executeFetch]);

  useEffect(() => {
    if (!immediate && isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    executeFetch();

    return () => {
      isMountedRef.current = false;
    };
  }, dependencies);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    setData,
    setError,
  };
}

export default useAsyncData;
