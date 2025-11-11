import api from '../axios';

export const promoService = {
  list: () => api.get('/api/v1/promos').then(r => r.data),
  byId: (id) => api.get(`/api/v1/promo/${id}`).then(r => r.data),
  create: (data) => api.post('/api/v1/create-promo', data).then(r => r.data),
  update: (id, data) => api.post(`/api/v1/update-promo/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/api/v1/delete-promo/${id}`).then(r => r.data),
};