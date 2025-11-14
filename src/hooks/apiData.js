import { useState, useEffect, useCallback } from 'react';

export function useApiData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result?.data ?? result ?? []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refresh: fetchData };
}