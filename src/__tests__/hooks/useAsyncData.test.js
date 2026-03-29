import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsyncData } from '../../hooks/useAsyncData';

describe('useAsyncData hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with null data and no error', () => {
      const fetchFn = vi.fn().mockResolvedValue('test data');
      const { result } = renderHook(() => useAsyncData(fetchFn, [], { immediate: false }));

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should start loading immediately by default', () => {
      const fetchFn = vi.fn().mockResolvedValue('test data');
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      expect(result.current.loading).toBe(true);
    });

    it('should not start loading when immediate is false', () => {
      const fetchFn = vi.fn().mockResolvedValue('test data');
      const { result } = renderHook(() => useAsyncData(fetchFn, [], { immediate: false }));

      expect(result.current.loading).toBe(false);
      expect(fetchFn).not.toHaveBeenCalled();
    });
  });

  describe('data fetching', () => {
    it('should fetch data successfully', async () => {
      const fetchFn = vi.fn().mockResolvedValue('test data');
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe('test data');
      expect(result.current.error).toBeNull();
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should fetch complex data objects', async () => {
      const complexData = { id: 1, name: 'Test', items: ['a', 'b', 'c'] };
      const fetchFn = vi.fn().mockResolvedValue(complexData);
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(complexData);
    });

    it('should fetch array data', async () => {
      const arrayData = [1, 2, 3, 4, 5];
      const fetchFn = vi.fn().mockResolvedValue(arrayData);
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(arrayData);
    });

    it('should handle errors', async () => {
      const error = new Error('Fetch failed');
      const fetchFn = vi.fn().mockRejectedValue(error);
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(error);
      expect(result.current.data).toBeNull();
    });

    it('should set loading to false after error', async () => {
      const fetchFn = vi.fn().mockRejectedValue(new Error('Error'));
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.loading).toBe(false);
    });

    it('should clear previous error on successful fetch', async () => {
      const fetchFn = vi
        .fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce('success data');

      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.data).toBe('success data');
      });
    });
  });

  describe('refetch', () => {
    it('should refetch data', async () => {
      const fetchFn = vi.fn().mockResolvedValue('initial data');
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.data).toBe('initial data');
      });

      fetchFn.mockResolvedValue('refetched data');

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.data).toBe('refetched data');
      });

      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('should set loading to true during refetch', async () => {
      const fetchFn = vi.fn().mockResolvedValue('data');
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.refetch();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should clear previous error before refetch', async () => {
      const fetchFn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Error'))
        .mockResolvedValueOnce('success');

      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('callbacks', () => {
    it('should call onSuccess callback when fetch succeeds', async () => {
      const fetchFn = vi.fn().mockResolvedValue('test data');
      const onSuccess = vi.fn();

      renderHook(() => useAsyncData(fetchFn, [], { onSuccess }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith('test data');
      });
    });

    it('should call onError callback when fetch fails', async () => {
      const error = new Error('Fetch failed');
      const fetchFn = vi.fn().mockRejectedValue(error);
      const onError = vi.fn();

      renderHook(() => useAsyncData(fetchFn, [], { onError }));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
    });

    it('should call callbacks on refetch', async () => {
      const fetchFn = vi.fn().mockResolvedValue('data');
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useAsyncData(fetchFn, [], { onSuccess }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('dependencies', () => {
    it('should refetch when dependencies change', async () => {
      const fetchFn = vi.fn().mockResolvedValue('data');
      const { rerender } = renderHook(
        ({ dep }) => useAsyncData(fetchFn, [dep]),
        { initialProps: { dep: 1 } }
      );

      await waitFor(() => {
        expect(fetchFn).toHaveBeenCalledTimes(1);
      });

      rerender({ dep: 2 });

      await waitFor(() => {
        expect(fetchFn).toHaveBeenCalledTimes(2);
      });
    });

    it('should not refetch when dependencies stay the same', async () => {
      const fetchFn = vi.fn().mockResolvedValue('data');
      const { rerender } = renderHook(
        ({ dep }) => useAsyncData(fetchFn, [dep]),
        { initialProps: { dep: 1 } }
      );

      await waitFor(() => {
        expect(fetchFn).toHaveBeenCalledTimes(1);
      });

      rerender({ dep: 1 });

      // Give it some time and verify it doesn't call again
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple dependencies', async () => {
      const fetchFn = vi.fn().mockResolvedValue('data');
      const { rerender } = renderHook(
        ({ dep1, dep2 }) => useAsyncData(fetchFn, [dep1, dep2]),
        { initialProps: { dep1: 1, dep2: 'a' } }
      );

      await waitFor(() => {
        expect(fetchFn).toHaveBeenCalledTimes(1);
      });

      rerender({ dep1: 2, dep2: 'a' });

      await waitFor(() => {
        expect(fetchFn).toHaveBeenCalledTimes(2);
      });

      rerender({ dep1: 2, dep2: 'b' });

      await waitFor(() => {
        expect(fetchFn).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('setData', () => {
    it('should manually set data', async () => {
      const fetchFn = vi.fn().mockResolvedValue('initial');
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.data).toBe('initial');
      });

      act(() => {
        result.current.setData('manual data');
      });

      expect(result.current.data).toBe('manual data');
    });
  });

  describe('setError', () => {
    it('should manually set error', async () => {
      const fetchFn = vi.fn().mockResolvedValue('data');
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const customError = new Error('Custom error');
      act(() => {
        result.current.setError(customError);
      });

      expect(result.current.error).toBe(customError);
    });
  });

  describe('cleanup', () => {
    it('should not update state after unmount', async () => {
      const fetchFn = vi.fn(
        () => new Promise((resolve) => setTimeout(() => resolve('data'), 100))
      );

      const { result, unmount } = renderHook(() => useAsyncData(fetchFn, []));

      expect(result.current.loading).toBe(true);

      unmount();

      // Wait for the fetch to complete
      await new Promise(resolve => setTimeout(resolve, 150));

      // No error should be thrown about setting state on unmounted component
    });

    it('should handle refetch cancellation on unmount', async () => {
      const fetchFn = vi.fn(
        () => new Promise((resolve) => setTimeout(() => resolve('data'), 100))
      );

      const { result, unmount } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.refetch();
      });

      unmount();

      // Wait for the refetch to complete
      await new Promise(resolve => setTimeout(resolve, 150));

      // No error should be thrown
    });
  });

  describe('immediate option', () => {
    it('should fetch immediately when immediate is true', async () => {
      const fetchFn = vi.fn().mockResolvedValue('data');
      renderHook(() => useAsyncData(fetchFn, [], { immediate: true }));

      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should not fetch immediately when immediate is false', async () => {
      const fetchFn = vi.fn().mockResolvedValue('data');
      renderHook(() => useAsyncData(fetchFn, [], { immediate: false }));

      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('should fetch on refetch even when immediate is false', async () => {
      const fetchFn = vi.fn().mockResolvedValue('data');
      const { result } = renderHook(() =>
        useAsyncData(fetchFn, [], { immediate: false })
      );

      expect(fetchFn).not.toHaveBeenCalled();

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(fetchFn).toHaveBeenCalledTimes(1);
        expect(result.current.data).toBe('data');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null return value', async () => {
      const fetchFn = vi.fn().mockResolvedValue(null);
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should handle undefined return value', async () => {
      const fetchFn = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should handle empty string return value', async () => {
      const fetchFn = vi.fn().mockResolvedValue('');
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe('');
      expect(result.current.error).toBeNull();
    });

    it('should handle number zero return value', async () => {
      const fetchFn = vi.fn().mockResolvedValue(0);
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(0);
      expect(result.current.error).toBeNull();
    });

    it('should handle boolean false return value', async () => {
      const fetchFn = vi.fn().mockResolvedValue(false);
      const { result } = renderHook(() => useAsyncData(fetchFn, []));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
