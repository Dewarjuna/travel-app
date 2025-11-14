import api from '../axios';

export const activityService = {
  list: () => api.get('/api/v1/activities').then(r => r.data),
  byId: (id) => api.get(`/api/v1/activity/${id}`).then(r => r.data),
  byCategory: (categoryId) =>
    api.get(`/api/v1/activities-by-category/${categoryId}`).then(r => r.data),
  create: (data) => api.post('/api/v1/create-activity', data).then(r => r.data), 
  update: (id, data) => api.post(`/api/v1/update-activity/${id}`, data).then(r => r.data), 
  remove: (id) => api.delete(`/api/v1/delete-activity/${id}`).then(r => r.data), 
};