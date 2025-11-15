// src/api/services/cartService.js
import api from '../axios';

export const cartService = {
  // Returns array from { code, status, message, data: [...] }
  list: () =>
    api.get('/api/v1/carts').then((r) => r.data.data),

  // /add-cart only expects activityId (NO quantity)
  // Postman body: { "activityId": "..." }
  add: (activityId) =>
    api.post('/api/v1/add-cart', { activityId }).then((r) => r.data),

  // /update-cart/:CART_ID expects body { "quantity": 4 }
  update: (cartId, quantity) =>
    api.post(`/api/v1/update-cart/${cartId}`, { quantity }).then((r) => r.data),

  remove: (cartId) =>
    api.delete(`/api/v1/delete-cart/${cartId}`).then((r) => r.data),
};