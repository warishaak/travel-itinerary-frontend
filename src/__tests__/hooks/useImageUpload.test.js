import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useImageUpload } from '../../hooks/useImageUpload';
import * as cloudinary from '../../utils/cloudinary';

vi.mock('../../utils/cloudinary');

describe('useImageUpload hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cloudinary.uploadToCloudinary.mockResolvedValue('https://cloudinary.com/image.jpg');
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useImageUpload());

      expect(result.current.uploading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.progress).toBe(0);
    });

    it('should accept custom options', () => {
      const { result } = renderHook(() =>
        useImageUpload({
          maxSize: 10 * 1024 * 1024,
          allowedTypes: ['image/png'],
          multiple: true,
        })
      );

      expect(result.current.uploading).toBe(false);
    });
  });

  describe('validateFile', () => {
    it('should validate a valid image file', () => {
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      const validation = result.current.validateFile(file);

      expect(validation.valid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it('should reject null file', () => {
      const { result } = renderHook(() => useImageUpload());

      const validation = result.current.validateFile(null);

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe('No file selected');
    });

    it('should reject undefined file', () => {
      const { result } = renderHook(() => useImageUpload());

      const validation = result.current.validateFile(undefined);

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe('No file selected');
    });

    it('should reject non-image file', () => {
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      const validation = result.current.validateFile(file);

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe('Please select an image file');
    });

    it('should reject file type not in allowed list', () => {
      const { result } = renderHook(() =>
        useImageUpload({ allowedTypes: ['image/png', 'image/jpeg'] })
      );
      const file = new File(['content'], 'test.gif', { type: 'image/gif' });

      const validation = result.current.validateFile(file);

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('Only');
      expect(validation.error).toContain('PNG');
      expect(validation.error).toContain('JPEG');
    });

    it('should reject file exceeding max size', () => {
      const { result } = renderHook(() =>
        useImageUpload({ maxSize: 1024 * 1024 }) // 1MB
      );
      const largeContent = new Array(2 * 1024 * 1024).fill('a').join('');
      const file = new File([largeContent], 'test.jpg', { type: 'image/jpeg' });

      const validation = result.current.validateFile(file);

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('must be smaller than');
      expect(validation.error).toContain('MB');
    });

    it('should accept file at max size boundary', () => {
      const { result } = renderHook(() =>
        useImageUpload({ maxSize: 1024 * 1024 }) // 1MB
      );
      const content = new Array(1024 * 1024).fill('a').join('');
      const file = new File([content], 'test.jpg', { type: 'image/jpeg' });

      const validation = result.current.validateFile(file);

      expect(validation.valid).toBe(true);
    });

    it('should validate all allowed types', () => {
      const { result } = renderHook(() => useImageUpload());
      const types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

      types.forEach(type => {
        const file = new File(['content'], `test.${type.split('/')[1]}`, { type });
        const validation = result.current.validateFile(file);
        expect(validation.valid).toBe(true);
      });
    });
  });

  describe('uploadImage - single file', () => {
    it('should upload single file successfully', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      let uploadedUrl;
      await act(async () => {
        uploadedUrl = await result.current.uploadImage(file);
      });

      expect(uploadedUrl).toBe('https://cloudinary.com/image.jpg');
      expect(cloudinary.uploadToCloudinary).toHaveBeenCalledWith(file);
      expect(result.current.uploading).toBe(false);
      expect(result.current.progress).toBe(100);
      expect(result.current.error).toBeNull();
    });

    it('should set uploading to true during upload', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      let uploadPromise;
      act(() => {
        uploadPromise = result.current.uploadImage(file);
      });

      expect(result.current.uploading).toBe(true);

      await act(async () => {
        await uploadPromise;
      });

      expect(result.current.uploading).toBe(false);
    });

    it('should handle upload failure', async () => {
      cloudinary.uploadToCloudinary.mockRejectedValue(new Error('Upload failed'));
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      await act(async () => {
        try {
          await result.current.uploadImage(file);
        } catch (error) {
          expect(error.message).toBe('Upload failed');
        }
      });

      expect(result.current.uploading).toBe(false);
      expect(result.current.error).toBe('Upload failed');
    });

    it('should handle validation failure', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      await act(async () => {
        try {
          await result.current.uploadImage(file);
        } catch (error) {
          expect(error.message).toBe('Please select an image file');
        }
      });

      expect(cloudinary.uploadToCloudinary).not.toHaveBeenCalled();
      expect(result.current.error).toBe('Please select an image file');
    });

    it('should clear previous error on new upload', async () => {
      const { result } = renderHook(() => useImageUpload());
      const invalidFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      // First upload fails
      await act(async () => {
        try {
          await result.current.uploadImage(invalidFile);
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBeTruthy();

      // Second upload succeeds
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      await act(async () => {
        await result.current.uploadImage(validFile);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('uploadImage - multiple files', () => {
    it('should upload multiple files when multiple option is enabled', async () => {
      const { result } = renderHook(() => useImageUpload({ multiple: true }));
      const files = [
        new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'test2.jpg', { type: 'image/jpeg' }),
        new File(['content3'], 'test3.jpg', { type: 'image/jpeg' }),
      ];

      cloudinary.uploadToCloudinary
        .mockResolvedValueOnce('https://cloudinary.com/image1.jpg')
        .mockResolvedValueOnce('https://cloudinary.com/image2.jpg')
        .mockResolvedValueOnce('https://cloudinary.com/image3.jpg');

      let uploadedUrls;
      await act(async () => {
        uploadedUrls = await result.current.uploadImage(files);
      });

      expect(uploadedUrls).toEqual([
        'https://cloudinary.com/image1.jpg',
        'https://cloudinary.com/image2.jpg',
        'https://cloudinary.com/image3.jpg',
      ]);
      expect(cloudinary.uploadToCloudinary).toHaveBeenCalledTimes(3);
    });

    it('should reject multiple files when multiple option is disabled', async () => {
      const { result } = renderHook(() => useImageUpload({ multiple: false }));
      const files = [
        new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'test2.jpg', { type: 'image/jpeg' }),
      ];

      await act(async () => {
        try {
          await result.current.uploadImage(files);
        } catch (error) {
          expect(error.message).toBe('Only one file can be uploaded at a time');
        }
      });

      expect(cloudinary.uploadToCloudinary).not.toHaveBeenCalled();
    });

    it('should update progress during multiple uploads', async () => {
      const { result } = renderHook(() => useImageUpload({ multiple: true }));
      const files = [
        new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'test2.jpg', { type: 'image/jpeg' }),
      ];

      cloudinary.uploadToCloudinary
        .mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('url'), 10)));

      await act(async () => {
        await result.current.uploadImage(files);
      });

      expect(result.current.progress).toBe(100);
    });

    it('should return single URL when uploading one file with multiple disabled', async () => {
      const { result } = renderHook(() => useImageUpload({ multiple: false }));
      const files = [new File(['content'], 'test.jpg', { type: 'image/jpeg' })];

      let uploadedUrl;
      await act(async () => {
        uploadedUrl = await result.current.uploadImage(files);
      });

      expect(uploadedUrl).toBe('https://cloudinary.com/image.jpg');
      expect(Array.isArray(uploadedUrl)).toBe(false);
    });

    it('should handle FileList input', async () => {
      const { result } = renderHook(() => useImageUpload());

      // Create a mock FileList
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = {
        0: file,
        length: 1,
        item: (index) => fileList[index],
        [Symbol.iterator]: function* () {
          for (let i = 0; i < this.length; i++) {
            yield this[i];
          }
        }
      };

      let uploadedUrl;
      await act(async () => {
        uploadedUrl = await result.current.uploadImage(fileList);
      });

      expect(uploadedUrl).toBe('https://cloudinary.com/image.jpg');
    });
  });

  describe('clearError', () => {
    it('should clear error', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      await act(async () => {
        try {
          await result.current.uploadImage(file);
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBeTruthy();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all state', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      await act(async () => {
        try {
          await result.current.uploadImage(file);
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBeTruthy();

      act(() => {
        result.current.reset();
      });

      expect(result.current.uploading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.progress).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle cloudinary upload returning null', async () => {
      cloudinary.uploadToCloudinary.mockResolvedValue(null);
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      let uploadedUrl;
      await act(async () => {
        uploadedUrl = await result.current.uploadImage(file);
      });

      expect(uploadedUrl).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should handle empty FileList', async () => {
      const { result } = renderHook(() => useImageUpload());
      const files = [];

      let uploadedUrl;
      await act(async () => {
        uploadedUrl = await result.current.uploadImage(files);
      });

      expect(uploadedUrl).toBeUndefined();
      expect(result.current.progress).toBe(100);
    });

    it('should handle error without message property', async () => {
      cloudinary.uploadToCloudinary.mockRejectedValue({ statusCode: 500 });
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      await act(async () => {
        try {
          await result.current.uploadImage(file);
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Failed to upload image');
    });

    it('should handle validation error for file size at exactly max size + 1', () => {
      const { result } = renderHook(() =>
        useImageUpload({ maxSize: 1024 * 1024 }) // 1MB
      );
      const content = new Array(1024 * 1024 + 1).fill('a').join('');
      const file = new File([content], 'test.jpg', { type: 'image/jpeg' });

      const validation = result.current.validateFile(file);

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('must be smaller than');
    });

    it('should handle empty allowedTypes array', () => {
      const { result } = renderHook(() =>
        useImageUpload({ allowedTypes: [] })
      );
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      const validation = result.current.validateFile(file);

      expect(validation.valid).toBe(true);
    });

    it('should preserve progress on successful upload', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      await act(async () => {
        await result.current.uploadImage(file);
      });

      expect(result.current.progress).toBe(100);

      // Upload another file
      await act(async () => {
        await result.current.uploadImage(file);
      });

      expect(result.current.progress).toBe(100);
    });
  });
});
