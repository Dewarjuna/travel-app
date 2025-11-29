import { useApiData } from './apiData';
import { userService } from '../api/services/userService';

export function useUsers() {
  const { data, loading, error, refresh } = useApiData(
    () => userService.getAll(),
    []
  );

  return {
    users: data || [],
    loading,
    error,
    refresh,
  };
}