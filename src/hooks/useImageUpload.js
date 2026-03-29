import { useState, useCallback } from 'react';
import { uploadToCloudinary } from '../utils/cloudinary';

export function useImageUpload(options = {}) {
  const {
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    multiple = false,
  } = options;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const validateFile = useCallback((file) => {
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select an image file' };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      const types = allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ');
      return { valid: false, error: `Only ${types} images are allowed` };
    }

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return { valid: false, error: `Image must be smaller than ${maxSizeMB}MB` };
    }

    return { valid: true };
  }, [maxSize, allowedTypes]);

  const uploadSingleFile = useCallback(async (file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const url = await uploadToCloudinary(file);
    return url;
  }, [validateFile]);

  const uploadImage = useCallback(async (files) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      if (files instanceof File) {
        const url = await uploadSingleFile(files);
        setProgress(100);
        return url;
      }

      const fileArray = Array.from(files);

      if (!multiple && fileArray.length > 1) {
        throw new Error('Only one file can be uploaded at a time');
      }

      const uploadPromises = fileArray.map(async (file, index) => {
        const url = await uploadSingleFile(file);
        setProgress(Math.round(((index + 1) / fileArray.length) * 100));
        return url;
      });

      const urls = await Promise.all(uploadPromises);

      return multiple ? urls : urls[0];

    } catch (err) {
      const errorMessage = err.message || 'Failed to upload image';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [multiple, uploadSingleFile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setError(null);
    setProgress(0);
  }, []);

  return {
    uploadImage,
    uploading,
    error,
    progress,
    clearError,
    reset,
    validateFile,
  };
}

export default useImageUpload;
