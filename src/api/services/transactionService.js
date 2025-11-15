// transactionService.js
import api from '../axios';

export const transactionService = {
  create: (cartIds, paymentMethodId) =>
    api.post('/api/v1/create-transaction', { cartIds, paymentMethodId }).then(r => r.data),

  myList: () =>
    api.get('/api/v1/my-transactions').then(r => r.data.data),

  byId: (id) =>
    api.get(`/api/v1/transaction/${id}`).then(r => r.data.data),

  all: () =>
    api.get('/api/v1/all-transactions').then(r => r.data.data),

  cancel: (id) =>
    api.post(`/api/v1/cancel-transaction/${id}`).then(r => r.data),

  updateProof: (id, proofPaymentUrl) =>
    api.post(`/api/v1/update-transaction-proof-payment/${id}`, { proofPaymentUrl }).then(r => r.data),

  updateStatus: (id, status) =>
    api.post(`/api/v1/update-transaction-status/${id}`, { status }).then(r => r.data),
};