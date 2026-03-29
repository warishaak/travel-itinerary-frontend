/**
 * API Interceptors for cross-cutting concerns
 * Provides request/response middleware for logging, error handling, and token refresh
 */

/**
 * Request interceptor - runs before every API call
 */
export const requestInterceptor = (url, options) => {
  // Log API calls in development
  if (import.meta.env.DEV) {
    console.log(`[API] ${options.method || 'GET'} ${url}`);
  }

  // Add timestamp to requests for debugging
  const modifiedOptions = {
    ...options,
    headers: {
      ...options.headers,
      'X-Request-ID': `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    },
  };

  return { url, options: modifiedOptions };
};

/**
 * Response interceptor - runs after every API call
 */
export const responseInterceptor = async (response, url, options) => {
  // Log response in development
  if (import.meta.env.DEV) {
    console.log(`[API] ${response.status} ${url}`);
  }

  // Handle 401 Unauthorized - token expired
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');

    // Attempt token refresh if we have a refresh token
    if (refreshToken && !url.includes('/token/refresh/')) {
      try {
        const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('access_token', data.access);

          // Retry original request with new token
          const retryOptions = {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${data.access}`,
            },
          };

          return fetch(url, retryOptions);
        }
      } catch (error) {
        console.error('[API] Token refresh failed:', error);
      }
    }

    // Clear tokens and reload to login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/#/login';
  }

  // Handle 403 Forbidden
  if (response.status === 403) {
    console.error('[API] Access forbidden:', url);
    // Could dispatch a notification event here
  }

  // Handle 500+ Server Errors
  if (response.status >= 500) {
    console.error('[API] Server error:', response.status, url);
    // Could dispatch error tracking event here
  }

  return response;
};

/**
 * Error interceptor - runs when network request fails
 */
export const errorInterceptor = (error, url) => {
  console.error('[API] Network error:', url, error);

  // Check if offline
  if (!navigator.onLine) {
    throw new Error('No internet connection. Please check your network.');
  }

  // Could dispatch error tracking event here
  throw error;
};
