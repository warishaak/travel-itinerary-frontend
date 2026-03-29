import { describe, it, expect } from 'vitest';
import {
  parseApiError,
  parseFieldErrors,
  isAuthError,
  isPermissionError,
  isNotFoundError,
  isValidationError,
  isServerError,
  getErrorMessage,
} from '../../utils/apiErrors';

describe('apiErrors utils', () => {
  describe('parseApiError', () => {
    it('should return string error as-is', () => {
      const result = parseApiError('Simple error message');
      expect(result).toBe('Simple error message');
    });

    it('should return detail string from error object', () => {
      const error = { detail: 'Error detail message' };
      const result = parseApiError(error);
      expect(result).toBe('Error detail message');
    });

    it('should return first item from detail array', () => {
      const error = { detail: ['First error', 'Second error'] };
      const result = parseApiError(error);
      expect(result).toBe('First error');
    });

    it('should parse email field error array', () => {
      const error = { email: ['Invalid email address'] };
      const result = parseApiError(error);
      expect(result).toBe('Invalid email address');
    });

    it('should parse email field error string', () => {
      const error = { email: 'Invalid email address' };
      const result = parseApiError(error);
      expect(result).toBe('Invalid email address');
    });

    it('should parse password field error', () => {
      const error = { password: ['Password too short'] };
      const result = parseApiError(error);
      expect(result).toBe('Password too short');
    });

    it('should parse password_confirm field error', () => {
      const error = { password_confirm: ['Passwords do not match'] };
      const result = parseApiError(error);
      expect(result).toBe('Passwords do not match');
    });

    it('should parse title field error', () => {
      const error = { title: ['Title is required'] };
      const result = parseApiError(error);
      expect(result).toBe('Title is required');
    });

    it('should parse destination field error', () => {
      const error = { destination: ['Destination is required'] };
      const result = parseApiError(error);
      expect(result).toBe('Destination is required');
    });

    it('should parse start_date field error', () => {
      const error = { start_date: ['Invalid date format'] };
      const result = parseApiError(error);
      expect(result).toBe('Invalid date format');
    });

    it('should parse end_date field error', () => {
      const error = { end_date: ['End date must be after start date'] };
      const result = parseApiError(error);
      expect(result).toBe('End date must be after start date');
    });

    it('should parse first_name field error', () => {
      const error = { first_name: ['First name is required'] };
      const result = parseApiError(error);
      expect(result).toBe('First name is required');
    });

    it('should parse last_name field error', () => {
      const error = { last_name: ['Last name is required'] };
      const result = parseApiError(error);
      expect(result).toBe('Last name is required');
    });

    it('should parse non_field_errors', () => {
      const error = { non_field_errors: ['General error'] };
      const result = parseApiError(error);
      expect(result).toBe('General error');
    });

    it('should return error.message if present', () => {
      const error = { message: 'Error message' };
      const result = parseApiError(error);
      expect(result).toBe('Error message');
    });

    it('should parse error.error string', () => {
      const error = { error: 'Something went wrong' };
      const result = parseApiError(error);
      expect(result).toBe('Something went wrong');
    });

    it('should return fallback for object error.error', () => {
      const error = { error: { nested: 'error' } };
      const result = parseApiError(error);
      expect(result).toBe('An error occurred. Please try again.');
    });

    it('should return fallback message for null error', () => {
      const result = parseApiError(null);
      expect(result).toBe('An error occurred. Please try again.');
    });

    it('should return fallback message for undefined error', () => {
      const result = parseApiError(undefined);
      expect(result).toBe('An error occurred. Please try again.');
    });

    it('should return fallback message for empty object', () => {
      const error = {};
      const result = parseApiError(error);
      expect(result).toBe('An error occurred. Please try again.');
    });

    it('should use custom fallback message', () => {
      const result = parseApiError(null, 'Custom fallback');
      expect(result).toBe('Custom fallback');
    });

    it('should prioritize detail over field errors', () => {
      const error = {
        detail: 'Detail message',
        email: ['Email error'],
      };
      const result = parseApiError(error);
      expect(result).toBe('Detail message');
    });

    it('should prioritize field errors over message', () => {
      const error = {
        email: ['Email error'],
        message: 'Generic message',
      };
      const result = parseApiError(error);
      expect(result).toBe('Email error');
    });
  });

  describe('parseFieldErrors', () => {
    it('should parse multiple field errors', () => {
      const error = {
        email: ['Invalid email'],
        password: ['Password too short'],
        title: ['Title required'],
      };
      const result = parseFieldErrors(error);
      expect(result).toEqual({
        email: 'Invalid email',
        password: 'Password too short',
        title: 'Title required',
      });
    });

    it('should parse field errors from arrays', () => {
      const error = {
        email: ['First error', 'Second error'],
      };
      const result = parseFieldErrors(error);
      expect(result.email).toBe('First error');
    });

    it('should parse field errors from strings', () => {
      const error = {
        email: 'Invalid email',
      };
      const result = parseFieldErrors(error);
      expect(result.email).toBe('Invalid email');
    });

    it('should skip status field', () => {
      const error = {
        status: 400,
        email: ['Invalid email'],
      };
      const result = parseFieldErrors(error);
      expect(result.status).toBeUndefined();
      expect(result.email).toBe('Invalid email');
    });

    it('should skip detail field', () => {
      const error = {
        detail: 'Error detail',
        email: ['Invalid email'],
      };
      const result = parseFieldErrors(error);
      expect(result.detail).toBeUndefined();
      expect(result.email).toBe('Invalid email');
    });

    it('should return empty object for null error', () => {
      const result = parseFieldErrors(null);
      expect(result).toEqual({});
    });

    it('should return empty object for undefined error', () => {
      const result = parseFieldErrors(undefined);
      expect(result).toEqual({});
    });

    it('should return empty object for non-object error', () => {
      const result = parseFieldErrors('string error');
      expect(result).toEqual({});
    });

    it('should return empty object when error is empty', () => {
      const result = parseFieldErrors({});
      expect(result).toEqual({});
    });

    it('should ignore empty arrays', () => {
      const error = {
        email: [],
        password: ['Password error'],
      };
      const result = parseFieldErrors(error);
      expect(result.email).toBeUndefined();
      expect(result.password).toBe('Password error');
    });
  });

  describe('isAuthError', () => {
    it('should return true for 401 status', () => {
      const error = { status: 401 };
      expect(isAuthError(error)).toBe(true);
    });

    it('should return false for 400 status', () => {
      const error = { status: 400 };
      expect(isAuthError(error)).toBe(false);
    });

    it('should return false for 403 status', () => {
      const error = { status: 403 };
      expect(isAuthError(error)).toBe(false);
    });

    it('should return false for 500 status', () => {
      const error = { status: 500 };
      expect(isAuthError(error)).toBe(false);
    });

    it('should return false for null error', () => {
      expect(isAuthError(null)).toBe(false);
    });

    it('should return false for undefined error', () => {
      expect(isAuthError(undefined)).toBe(false);
    });

    it('should return false for error without status', () => {
      const error = { message: 'Error' };
      expect(isAuthError(error)).toBe(false);
    });
  });

  describe('isPermissionError', () => {
    it('should return true for 403 status', () => {
      const error = { status: 403 };
      expect(isPermissionError(error)).toBe(true);
    });

    it('should return false for 401 status', () => {
      const error = { status: 401 };
      expect(isPermissionError(error)).toBe(false);
    });

    it('should return false for 404 status', () => {
      const error = { status: 404 };
      expect(isPermissionError(error)).toBe(false);
    });

    it('should return false for null error', () => {
      expect(isPermissionError(null)).toBe(false);
    });
  });

  describe('isNotFoundError', () => {
    it('should return true for 404 status', () => {
      const error = { status: 404 };
      expect(isNotFoundError(error)).toBe(true);
    });

    it('should return false for 400 status', () => {
      const error = { status: 400 };
      expect(isNotFoundError(error)).toBe(false);
    });

    it('should return false for 403 status', () => {
      const error = { status: 403 };
      expect(isNotFoundError(error)).toBe(false);
    });

    it('should return false for null error', () => {
      expect(isNotFoundError(null)).toBe(false);
    });
  });

  describe('isValidationError', () => {
    it('should return true for 400 status', () => {
      const error = { status: 400 };
      expect(isValidationError(error)).toBe(true);
    });

    it('should return false for 401 status', () => {
      const error = { status: 401 };
      expect(isValidationError(error)).toBe(false);
    });

    it('should return false for 404 status', () => {
      const error = { status: 404 };
      expect(isValidationError(error)).toBe(false);
    });

    it('should return false for 500 status', () => {
      const error = { status: 500 };
      expect(isValidationError(error)).toBe(false);
    });

    it('should return false for null error', () => {
      expect(isValidationError(null)).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should return true for 500 status', () => {
      const error = { status: 500 };
      expect(isServerError(error)).toBe(true);
    });

    it('should return true for 502 status', () => {
      const error = { status: 502 };
      expect(isServerError(error)).toBe(true);
    });

    it('should return true for 503 status', () => {
      const error = { status: 503 };
      expect(isServerError(error)).toBe(true);
    });

    it('should return false for 400 status', () => {
      const error = { status: 400 };
      expect(isServerError(error)).toBe(false);
    });

    it('should return false for 401 status', () => {
      const error = { status: 401 };
      expect(isServerError(error)).toBe(false);
    });

    it('should return false for 404 status', () => {
      const error = { status: 404 };
      expect(isServerError(error)).toBe(false);
    });

    it('should return false for null error', () => {
      expect(isServerError(null)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should return auth message for 401 error', () => {
      const error = { status: 401 };
      const result = getErrorMessage(error);
      expect(result).toBe('Your session has expired. Please log in again.');
    });

    it('should return permission message for 403 error', () => {
      const error = { status: 403 };
      const result = getErrorMessage(error);
      expect(result).toBe('You do not have permission to perform this action.');
    });

    it('should return not found message for 404 error', () => {
      const error = { status: 404 };
      const result = getErrorMessage(error);
      expect(result).toBe('The requested resource was not found.');
    });

    it('should return server error message for 500 error', () => {
      const error = { status: 500 };
      const result = getErrorMessage(error);
      expect(result).toBe('A server error occurred. Please try again later.');
    });

    it('should return server error message for 502 error', () => {
      const error = { status: 502 };
      const result = getErrorMessage(error);
      expect(result).toBe('A server error occurred. Please try again later.');
    });

    it('should parse custom error for validation errors', () => {
      const error = {
        status: 400,
        email: ['Invalid email address'],
      };
      const result = getErrorMessage(error);
      expect(result).toBe('Invalid email address');
    });

    it('should parse detail for validation errors', () => {
      const error = {
        status: 400,
        detail: 'Validation failed',
      };
      const result = getErrorMessage(error);
      expect(result).toBe('Validation failed');
    });

    it('should fallback to parseApiError for unknown errors', () => {
      const error = { detail: 'Unknown error' };
      const result = getErrorMessage(error);
      expect(result).toBe('Unknown error');
    });

    it('should prioritize status-based messages', () => {
      const error = {
        status: 401,
        detail: 'Invalid token',
      };
      const result = getErrorMessage(error);
      expect(result).toBe('Your session has expired. Please log in again.');
    });
  });
});
