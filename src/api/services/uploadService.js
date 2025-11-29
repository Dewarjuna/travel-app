import api from '../axios';

export const uploadService = {
  /**
   * Upload a single image file.
   * @param {File} file
   * @returns {Promise<string>} image URL from backend
   */
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/api/v1/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const url = response?.data?.url;

    if (!url) {
      throw new Error('Upload succeeded but no image URL returned');
    }

    return url;
  },
};