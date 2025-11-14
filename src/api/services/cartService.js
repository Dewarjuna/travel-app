import api from '../axios';

export const cartService = {
  list: () => api.get('/api/v1/carts').then(r => r.data),
  add: (activityId, quantity = 1) =>
    api.post('/api/v1/add-cart', { activityId, quantity }).then(r => r.data),
  update: (cartId, quantity) =>
    api.post(`/api/v1/update-cart/${cartId}`, { quantity }).then(r => r.data),
  remove: (cartId) => api.delete(`/api/v1/delete-cart/${cartId}`).then(r => r.data),
};