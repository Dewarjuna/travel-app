import { useState, useCallback } from 'react';

export function useMutation(mutator) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await mutator(...args);
      return res;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [mutator]);

  return { mutate, loading, error };
}