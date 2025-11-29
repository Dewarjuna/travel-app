import { useState, useCallback } from 'react';
import { uploadService } from '../api/services/uploadService';

export const useUploadImage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file) => {
    setUploading(true);
    setError(null);

    try {
      const url = await uploadService.uploadImage(file);
      return url;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error };
};