import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateFutureDate,
  validateDateRange,
  combineValidations,
} from '../../utils/validation';

describe('validation utils', () => {
  describe('validateEmail', () => {
    it('should validate a correct email address', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject null email', () => {
      const result = validateEmail(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject undefined email', () => {
      const result = validateEmail(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject non-string email', () => {
      const result = validateEmail(123);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject whitespace-only email', () => {
      const result = validateEmail('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject email without @ symbol', () => {
      const result = validateEmail('testexample.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email without domain', () => {
      const result = validateEmail('test@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email without TLD', () => {
      const result = validateEmail('test@example');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should accept email with trimmed whitespace', () => {
      const result = validateEmail('  test@example.com  ');
      expect(result.valid).toBe(true);
    });

    it('should accept email with subdomain', () => {
      const result = validateEmail('test@mail.example.com');
      expect(result.valid).toBe(true);
    });

    it('should accept email with plus sign', () => {
      const result = validateEmail('test+tag@example.com');
      expect(result.valid).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('should validate password with default min length', () => {
      const result = validatePassword('password123');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate password with custom min length', () => {
      const result = validatePassword('pass', { minLength: 4 });
      expect(result.valid).toBe(true);
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should reject null password', () => {
      const result = validatePassword(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should reject undefined password', () => {
      const result = validatePassword(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should reject password shorter than min length', () => {
      const result = validatePassword('short');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });

    it('should reject password shorter than custom min length', () => {
      const result = validatePassword('abc', { minLength: 5 });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must be at least 5 characters');
    });

    it('should accept password exactly at min length', () => {
      const result = validatePassword('12345678');
      expect(result.valid).toBe(true);
    });
  });

  describe('validatePasswordMatch', () => {
    it('should validate matching passwords', () => {
      const result = validatePasswordMatch('password123', 'password123');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject non-matching passwords', () => {
      const result = validatePasswordMatch('password123', 'different');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should reject empty confirm password', () => {
      const result = validatePasswordMatch('password123', '');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });

    it('should reject null confirm password', () => {
      const result = validatePasswordMatch('password123', null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });

    it('should reject undefined confirm password', () => {
      const result = validatePasswordMatch('password123', undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty string', () => {
      const result = validateRequired('value');
      expect(result.valid).toBe(true);
    });

    it('should validate non-empty value with custom field name', () => {
      const result = validateRequired('value', 'Username');
      expect(result.valid).toBe(true);
    });

    it('should reject empty string', () => {
      const result = validateRequired('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('This field is required');
    });

    it('should reject null value', () => {
      const result = validateRequired(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('This field is required');
    });

    it('should reject undefined value', () => {
      const result = validateRequired(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('This field is required');
    });

    it('should reject whitespace-only string', () => {
      const result = validateRequired('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('This field is required');
    });

    it('should use custom field name in error message', () => {
      const result = validateRequired('', 'Email');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should accept number zero', () => {
      const result = validateRequired(0);
      expect(result.valid).toBe(true);
    });

    it('should accept boolean false', () => {
      const result = validateRequired(false);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateMinLength', () => {
    it('should validate string meeting min length', () => {
      const result = validateMinLength('hello', 3);
      expect(result.valid).toBe(true);
    });

    it('should validate string exactly at min length', () => {
      const result = validateMinLength('hello', 5);
      expect(result.valid).toBe(true);
    });

    it('should reject string below min length', () => {
      const result = validateMinLength('hi', 5);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('This field must be at least 5 characters');
    });

    it('should use custom field name in error message', () => {
      const result = validateMinLength('hi', 5, 'Title');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title must be at least 5 characters');
    });

    it('should accept empty value', () => {
      const result = validateMinLength('', 5);
      expect(result.valid).toBe(true);
    });

    it('should accept null value', () => {
      const result = validateMinLength(null, 5);
      expect(result.valid).toBe(true);
    });

    it('should accept undefined value', () => {
      const result = validateMinLength(undefined, 5);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateMaxLength', () => {
    it('should validate string within max length', () => {
      const result = validateMaxLength('hello', 10);
      expect(result.valid).toBe(true);
    });

    it('should validate string exactly at max length', () => {
      const result = validateMaxLength('hello', 5);
      expect(result.valid).toBe(true);
    });

    it('should reject string exceeding max length', () => {
      const result = validateMaxLength('hello world', 5);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('This field must not exceed 5 characters');
    });

    it('should use custom field name in error message', () => {
      const result = validateMaxLength('hello world', 5, 'Description');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Description must not exceed 5 characters');
    });

    it('should accept empty value', () => {
      const result = validateMaxLength('', 5);
      expect(result.valid).toBe(true);
    });

    it('should accept null value', () => {
      const result = validateMaxLength(null, 5);
      expect(result.valid).toBe(true);
    });

    it('should accept undefined value', () => {
      const result = validateMaxLength(undefined, 5);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateFutureDate', () => {
    it('should validate future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const result = validateFutureDate(futureDate.toISOString().split('T')[0]);
      expect(result.valid).toBe(true);
    });

    it('should validate today as valid (not past)', () => {
      const today = new Date();
      const result = validateFutureDate(today.toISOString().split('T')[0]);
      expect(result.valid).toBe(true);
    });

    it('should reject past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      const result = validateFutureDate(pastDate.toISOString().split('T')[0]);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date cannot be in the past');
    });

    it('should use custom field name in error message', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      const result = validateFutureDate(pastDate.toISOString().split('T')[0], 'Start Date');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Start Date cannot be in the past');
    });

    it('should accept empty date', () => {
      const result = validateFutureDate('');
      expect(result.valid).toBe(true);
    });

    it('should accept null date', () => {
      const result = validateFutureDate(null);
      expect(result.valid).toBe(true);
    });

    it('should accept undefined date', () => {
      const result = validateFutureDate(undefined);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateDateRange', () => {
    it('should validate valid date range', () => {
      const result = validateDateRange('2024-01-01', '2024-01-10');
      expect(result.valid).toBe(true);
    });

    it('should validate same start and end date', () => {
      const result = validateDateRange('2024-01-01', '2024-01-01');
      expect(result.valid).toBe(true);
    });

    it('should reject end date before start date', () => {
      const result = validateDateRange('2024-01-10', '2024-01-01');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('End date must be after start date');
    });

    it('should accept when only start date is provided', () => {
      const result = validateDateRange('2024-01-01', '');
      expect(result.valid).toBe(true);
    });

    it('should accept when only end date is provided', () => {
      const result = validateDateRange('', '2024-01-10');
      expect(result.valid).toBe(true);
    });

    it('should accept when both dates are empty', () => {
      const result = validateDateRange('', '');
      expect(result.valid).toBe(true);
    });

    it('should accept when dates are null', () => {
      const result = validateDateRange(null, null);
      expect(result.valid).toBe(true);
    });

    it('should accept when dates are undefined', () => {
      const result = validateDateRange(undefined, undefined);
      expect(result.valid).toBe(true);
    });
  });

  describe('combineValidations', () => {
    it('should return valid when all validations pass', () => {
      const result = combineValidations(
        { valid: true },
        { valid: true },
        { valid: true }
      );
      expect(result.valid).toBe(true);
    });

    it('should return first error when validation fails', () => {
      const result = combineValidations(
        { valid: true },
        { valid: false, error: 'First error' },
        { valid: false, error: 'Second error' }
      );
      expect(result.valid).toBe(false);
      expect(result.error).toBe('First error');
    });

    it('should handle single validation', () => {
      const result = combineValidations({ valid: true });
      expect(result.valid).toBe(true);
    });

    it('should handle no validations', () => {
      const result = combineValidations();
      expect(result.valid).toBe(true);
    });

    it('should stop at first failure', () => {
      const result = combineValidations(
        { valid: false, error: 'Error 1' },
        { valid: false, error: 'Error 2' }
      );
      expect(result.error).toBe('Error 1');
    });
  });
});
