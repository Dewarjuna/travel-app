import api from '../axios';

export const uploadService = {
  image: async (file) => {
    const form = new FormData();
    form.append('image', file);
    const res = await api.post('/api/v1/upload-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};