import api from '../axios';

export const bannerService = {
  list: () => api.get('/api/v1/banners').then(r => r.data),
  byId: (id) => api.get(`/api/v1/banner/${id}`).then(r => r.data),
  create: (data) => api.post('/api/v1/create-banner', data).then(r => r.data), 
  update: (id, data) => api.post(`/api/v1/update-banner/${id}`, data).then(r => r.data), 
  remove: (id) => api.delete(`/api/v1/delete-banner/${id}`).then(r => r.data), 
};