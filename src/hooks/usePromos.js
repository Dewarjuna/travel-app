import { useApiData } from "./apiData";
import { promoService } from '../api/services/promoService';
export function usePromos() {
  const { data, loading, error, refresh } = useApiData(() => promoService.list(), []);
  return { promos: data || [], loading, error, refresh };
}