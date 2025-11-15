import { useApiData } from './apiData';
import { activityService } from '../api/services/activityService';

export function useActivities(categoryId) {
  const fetcher = categoryId
    ? () => activityService.byCategory(categoryId)
    : () => activityService.list();
    
  const { data, loading, error, refresh } = useApiData(fetcher, [categoryId]);
  return { activities: data || [], loading, error, refresh };
}

export function useActivity(id) {
  const { data, loading, error, refresh } = useApiData(() => activityService.byId(id), [id]);
  return { activity: data || null, loading, error, refresh };
}