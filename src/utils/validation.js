export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
}

export function validatePassword(password, options = {}) {
  const { minLength = 8 } = options;

  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return { valid: false, error: `Password must be at least ${minLength} characters` };
  }

  return { valid: true };
}

export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }

  return { valid: true };
}

export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (typeof value === 'string' && !value.trim()) {
    return { valid: false, error: `${fieldName} is required` };
  }

  return { valid: true };
}

export function validateMinLength(value, minLength, fieldName = 'This field') {
  if (!value) {
    return { valid: true };
  }

  if (value.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  return { valid: true };
}

export function validateMaxLength(value, maxLength, fieldName = 'This field') {
  if (!value) {
    return { valid: true };
  }

  if (value.length > maxLength) {
    return { valid: false, error: `${fieldName} must not exceed ${maxLength} characters` };
  }

  return { valid: true };
}

export function validateFutureDate(date, fieldName = 'Date') {
  if (!date) {
    return { valid: true };
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { valid: false, error: `${fieldName} cannot be in the past` };
  }

  return { valid: true };
}

export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return { valid: true };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return { valid: false, error: 'End date must be after start date' };
  }

  return { valid: true };
}

export function combineValidations(...validations) {
  for (const validation of validations) {
    if (!validation.valid) {
      return validation;
    }
  }
  return { valid: true };
}
