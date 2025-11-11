import api from '../axios';

export const categoryService = {
  list: () => api.get('/api/v1/categories').then(r => r.data),
  detail: (id) => api.get(`/api/v1/category/${id}`).then(r => r.data),
  create: (data) => api.post('/api/v1/create-category', data).then(r => r.data),
  update: (id, data) => api.post(`/api/v1/update-category/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/api/v1/delete-category/${id}`).then(r => r.data),
};