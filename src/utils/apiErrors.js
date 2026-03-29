export function parseApiError(error, fallbackMessage = 'An error occurred. Please try again.') {
  if (typeof error === 'string') {
    return error;
  }

  if (!error) {
    return fallbackMessage;
  }

  if (error.detail) {
    if (typeof error.detail === 'string') {
      return error.detail;
    }
    if (Array.isArray(error.detail) && error.detail.length > 0) {
      return error.detail[0];
    }
  }

  const fieldErrors = [
    'email',
    'password',
    'password_confirm',
    'title',
    'destination',
    'start_date',
    'end_date',
    'first_name',
    'last_name',
    'non_field_errors',
  ];

  for (const field of fieldErrors) {
    if (error[field]) {
      if (Array.isArray(error[field]) && error[field].length > 0) {
        return error[field][0];
      }
      if (typeof error[field] === 'string') {
        return error[field];
      }
    }
  }

  if (error.message) {
    return error.message;
  }

  if (error.error) {
    return typeof error.error === 'string' ? error.error : fallbackMessage;
  }

  return fallbackMessage;
}

export function parseFieldErrors(error) {
  const fieldErrors = {};

  if (!error || typeof error !== 'object') {
    return fieldErrors;
  }

  for (const [key, value] of Object.entries(error)) {
    if (key === 'status' || key === 'detail') {
      continue;
    }

    if (Array.isArray(value) && value.length > 0) {
      fieldErrors[key] = value[0];
    } else if (typeof value === 'string') {
      fieldErrors[key] = value;
    }
  }

  return fieldErrors;
}

export function isAuthError(error) {
  return error && error.status === 401;
}

export function isPermissionError(error) {
  return error && error.status === 403;
}

export function isNotFoundError(error) {
  return error && error.status === 404;
}

export function isValidationError(error) {
  return error && error.status === 400;
}

export function isServerError(error) {
  return error && error.status >= 500;
}

export function getErrorMessage(error) {
  if (isAuthError(error)) {
    return 'Your session has expired. Please log in again.';
  }

  if (isPermissionError(error)) {
    return 'You do not have permission to perform this action.';
  }

  if (isNotFoundError(error)) {
    return 'The requested resource was not found.';
  }

  if (isServerError(error)) {
    return 'A server error occurred. Please try again later.';
  }

  return parseApiError(error);
}
