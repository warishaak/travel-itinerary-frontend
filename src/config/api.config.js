/**
 * API Configuration Module
 * Centralizes all API-related configuration and environment variables
 */

/**
 * API Base URL
 * Determined by environment (development/production)
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds
  version: 'v1',
};

/**
 * JWT Configuration
 */
export const JWT_CONFIG = {
  accessTokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  // Token refresh threshold (refresh when less than 5 minutes remaining)
  refreshThreshold: 5 * 60 * 1000,
};

/**
 * Cloudinary Configuration
 */
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
};

/**
 * API Endpoints
 * Organized by domain for easy maintenance
 */
export const API_ENDPOINTS = {
  auth: {
    token: '/api/auth/token/',
    tokenRefresh: '/api/auth/token/refresh/',
    register: '/api/auth/register/',
    me: '/api/auth/me/',
    passwordReset: {
      request: '/api/auth/password-reset/request/',
      confirm: '/api/auth/password-reset/confirm/',
    },
  },
  itineraries: {
    my: '/api/itineraries/my/',
    myDetail: (id) => `/api/itineraries/my/${id}/`,
    updateStatus: (id) => `/api/itineraries/my/${id}/update_status/`,
    public: '/api/itineraries/public/',
    publicDetail: (id) => `/api/itineraries/public/${id}/`,
  },
};

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Environment helper
 */
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

/**
 * Feature flags
 * Can be used to enable/disable features per environment
 */
export const FEATURE_FLAGS = {
  enableApiLogging: ENV.isDevelopment,
  enableErrorTracking: ENV.isProduction,
  enableTokenRefresh: true,
};
