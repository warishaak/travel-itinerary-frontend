import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useForm } from '../../hooks/useForm';

describe('useForm hook', () => {
  const initialValues = {
    email: '',
    password: '',
    remember: false,
  };

  const validationRules = {
    email: (value) => {
      if (!value) return { valid: false, error: 'Email is required' };
      if (!value.includes('@')) return { valid: false, error: 'Invalid email' };
      return { valid: true };
    },
    password: (value) => {
      if (!value) return { valid: false, error: 'Password is required' };
      if (value.length < 8) return { valid: false, error: 'Password too short' };
      return { valid: true };
    },
  };

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isValid).toBe(true);
      expect(result.current.isDirty).toBe(false);
    });

    it('should initialize with validation rules', () => {
      const { result } = renderHook(() =>
        useForm(initialValues, validationRules, vi.fn())
      );

      expect(result.current.values).toEqual(initialValues);
    });
  });

  describe('handleChange', () => {
    it('should update text input value', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'test@example.com', type: 'text' },
        });
      });

      expect(result.current.values.email).toBe('test@example.com');
    });

    it('should update checkbox value', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.handleChange({
          target: { name: 'remember', checked: true, type: 'checkbox' },
        });
      });

      expect(result.current.values.remember).toBe(true);
    });

    it('should clear error for changed field', () => {
      const { result } = renderHook(() =>
        useForm(initialValues, validationRules, vi.fn())
      );

      // Set an error first
      act(() => {
        result.current.setError('email', 'Email is required');
      });

      expect(result.current.errors.email).toBe('Email is required');

      // Change the field value
      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'test@example.com', type: 'text' },
        });
      });

      expect(result.current.errors.email).toBeUndefined();
    });

    it('should mark form as dirty', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      expect(result.current.isDirty).toBe(false);

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'test@example.com', type: 'text' },
        });
      });

      expect(result.current.isDirty).toBe(true);
    });
  });

  describe('handleBlur', () => {
    it('should mark field as touched', () => {
      const { result } = renderHook(() =>
        useForm(initialValues, validationRules, vi.fn())
      );

      act(() => {
        result.current.handleBlur({ target: { name: 'email' } });
      });

      expect(result.current.touched.email).toBe(true);
    });

    it('should validate field on blur', () => {
      const { result } = renderHook(() =>
        useForm(initialValues, validationRules, vi.fn())
      );

      act(() => {
        result.current.handleBlur({ target: { name: 'email' } });
      });

      expect(result.current.errors.email).toBe('Email is required');
    });

    it('should not set error if field is valid', () => {
      const { result } = renderHook(() =>
        useForm(initialValues, validationRules, vi.fn())
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'test@example.com', type: 'text' },
        });
      });

      act(() => {
        result.current.handleBlur({ target: { name: 'email' } });
      });

      expect(result.current.errors.email).toBeUndefined();
    });

    it('should handle fields without validation rules', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.handleBlur({ target: { name: 'email' } });
      });

      expect(result.current.errors.email).toBeUndefined();
    });
  });

  describe('validateForm', () => {
    it('should validate all fields', () => {
      const { result } = renderHook(() =>
        useForm(initialValues, validationRules, vi.fn())
      );

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.email).toBe('Email is required');
      expect(result.current.errors.password).toBe('Password is required');
    });

    it('should return true when all fields are valid', () => {
      const { result } = renderHook(() =>
        useForm(
          { email: 'test@example.com', password: 'password123' },
          validationRules,
          vi.fn()
        )
      );

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual({});
    });

    it('should update isValid property', () => {
      const { result } = renderHook(() =>
        useForm(initialValues, validationRules, vi.fn())
      );

      expect(result.current.isValid).toBe(true); // No errors initially

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.isValid).toBe(false);
    });
  });

  describe('handleSubmit', () => {
    it('should prevent default form submission', () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm(
          { email: 'test@example.com', password: 'password123' },
          validationRules,
          onSubmit
        )
      );

      const mockEvent = { preventDefault: vi.fn() };

      act(() => {
        result.current.handleSubmit(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should mark all fields as touched', async () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm(
          { email: 'test@example.com', password: 'password123' },
          validationRules,
          onSubmit
        )
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.touched.email).toBe(true);
      expect(result.current.touched.password).toBe(true);
    });

    it('should call onSubmit when form is valid', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useForm(
          { email: 'test@example.com', password: 'password123' },
          validationRules,
          onSubmit
        )
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should not call onSubmit when form is invalid', async () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm(initialValues, validationRules, onSubmit)
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should set isSubmitting to true during submission', async () => {
      let resolveSubmit;
      const onSubmit = vi.fn(
        () => new Promise((resolve) => (resolveSubmit = resolve))
      );

      const { result } = renderHook(() =>
        useForm(
          { email: 'test@example.com', password: 'password123' },
          validationRules,
          onSubmit
        )
      );

      act(() => {
        result.current.handleSubmit();
      });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true);
      });

      await act(async () => {
        resolveSubmit();
      });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(false);
      });
    });

    it('should handle submission errors', async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error('Submit failed'));
      const { result } = renderHook(() =>
        useForm(
          { email: 'test@example.com', password: 'password123' },
          validationRules,
          onSubmit
        )
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset form to initial values', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'test@example.com', type: 'text' },
        });
      });

      expect(result.current.values.email).toBe('test@example.com');

      act(() => {
        result.current.reset();
      });

      expect(result.current.values).toEqual(initialValues);
    });

    it('should clear errors', () => {
      const { result } = renderHook(() =>
        useForm(initialValues, validationRules, vi.fn())
      );

      act(() => {
        result.current.setError('email', 'Email is required');
      });

      expect(result.current.errors.email).toBe('Email is required');

      act(() => {
        result.current.reset();
      });

      expect(result.current.errors).toEqual({});
    });

    it('should clear touched fields', () => {
      const { result } = renderHook(() =>
        useForm(initialValues, validationRules, vi.fn())
      );

      act(() => {
        result.current.handleBlur({ target: { name: 'email' } });
      });

      expect(result.current.touched.email).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.touched).toEqual({});
    });

    it('should reset isSubmitting', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.reset();
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('setFormValues', () => {
    it('should update multiple values at once', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.setFormValues({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.values.email).toBe('test@example.com');
      expect(result.current.values.password).toBe('password123');
    });

    it('should merge with existing values', () => {
      const { result } = renderHook(() =>
        useForm({ ...initialValues, name: 'John' }, {}, vi.fn())
      );

      act(() => {
        result.current.setFormValues({ email: 'test@example.com' });
      });

      expect(result.current.values.email).toBe('test@example.com');
      expect(result.current.values.name).toBe('John');
    });
  });

  describe('setValue', () => {
    it('should update single field value', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.setValue('email', 'test@example.com');
      });

      expect(result.current.values.email).toBe('test@example.com');
    });
  });

  describe('setError', () => {
    it('should set error for specific field', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.setError('email', 'Custom error message');
      });

      expect(result.current.errors.email).toBe('Custom error message');
    });

    it('should update isValid property', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      expect(result.current.isValid).toBe(true);

      act(() => {
        result.current.setError('email', 'Error message');
      });

      expect(result.current.isValid).toBe(false);
    });
  });

  describe('clearErrors', () => {
    it('should clear all errors', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.setError('email', 'Error 1');
        result.current.setError('password', 'Error 2');
      });

      expect(result.current.errors.email).toBe('Error 1');
      expect(result.current.errors.password).toBe('Error 2');

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.errors).toEqual({});
    });
  });

  describe('isDirty', () => {
    it('should be false initially', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      expect(result.current.isDirty).toBe(false);
    });

    it('should be true when values change', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.setValue('email', 'test@example.com');
      });

      expect(result.current.isDirty).toBe(true);
    });

    it('should be false after reset', () => {
      const { result } = renderHook(() => useForm(initialValues, {}, vi.fn()));

      act(() => {
        result.current.setValue('email', 'test@example.com');
      });

      expect(result.current.isDirty).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isDirty).toBe(false);
    });
  });

  describe('validation with all values', () => {
    it('should pass all values to validation function', () => {
      const passwordConfirmRule = vi.fn((value, allValues) => {
        if (value !== allValues.password) {
          return { valid: false, error: 'Passwords do not match' };
        }
        return { valid: true };
      });

      const rules = {
        password: () => ({ valid: true }),
        passwordConfirm: passwordConfirmRule,
      };

      const { result } = renderHook(() =>
        useForm({ password: 'test123', passwordConfirm: 'test456' }, rules, vi.fn())
      );

      act(() => {
        result.current.handleBlur({ target: { name: 'passwordConfirm' } });
      });

      expect(passwordConfirmRule).toHaveBeenCalledWith('test456', {
        password: 'test123',
        passwordConfirm: 'test456',
      });
    });
  });
});
