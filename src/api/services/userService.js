import api from '../axios';

export const userService = {
  profile: () => api.get('/api/v1/user').then(r => r.data),
  getAll: () => api.get('/api/v1/all-user').then(r => r.data),
  updateProfile: (data) => api.post('/api/v1/update-profile', data).then(r => r.data),
  updateRole: (id, role) =>
    api.post(`/api/v1/update-user-role/${id}`, { role }).then(r => r.data),
};