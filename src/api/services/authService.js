import api from '../axios';

export const authService = {
  register: (data) => api.post('/api/v1/register', data).then(r => r.data),
  login: async (data) => {
    const res = await api.post('/api/v1/login', data);
    if (res.data?.token) localStorage.setItem('token', res.data.token);
    return res.data;
  },
  logout: async () => {
    const res = await api.get('/api/v1/logout');
    localStorage.removeItem('token');
    return res.data;
  },
  me: () => api.get('/api/v1/user').then(r => r.data),
};