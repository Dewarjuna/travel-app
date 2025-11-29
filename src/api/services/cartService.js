import api from '../axios';

export const cartService = {
  list: () =>
    api.get('/api/v1/carts').then((r) => r.data.data),

  add: (activityId) =>
    api.post('/api/v1/add-cart', { activityId }).then((r) => r.data),

  update: (cartId, quantity) =>
    api.post(`/api/v1/update-cart/${cartId}`, { quantity }).then((r) => r.data),

  remove: (cartId) =>
    api.delete(`/api/v1/delete-cart/${cartId}`).then((r) => r.data),
};