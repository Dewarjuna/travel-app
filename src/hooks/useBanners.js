import { useApiData } from './apiData';
import { bannerService } from '../api/services/bannerService';
export function useBanners() {
  const { data, loading, error, refresh } = useApiData(() => bannerService.list(), []);
  return { banners: data || [], loading, error, refresh };
}