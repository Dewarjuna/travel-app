import api from '../axios';

export const paymentMethodService = {
  list: () => api.get('/api/v1/payment-methods').then(r => r.data),
  generate: () => api.post('/api/v1/generate-payment-methods').then(r => r.data),
};