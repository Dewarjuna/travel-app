import { useApiData } from './apiData';
import { activityService } from '../api/services/activityService';
export function useActivities() {
  const { data, loading, error, refresh } = useApiData(() => activityService.list(), []);
  return { activities: data || [], loading, error, refresh };
}