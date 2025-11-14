import { useApiData } from "./apiData";
import { categoryService } from '../api/services/categoryService';
export function useCategories() {
  const { data, loading, error, refresh } = useApiData(() => categoryService.list(), []);
  return { categories: data || [], loading, error, refresh };
}