/**
 * Theme Constants
 * Centralized color palette and design tokens
 * Used across all components to maintain consistency
 */

export const COLORS = {
  // Primary colors
  primary: '#0f766e',
  primaryHover: '#0d6860',
  primaryLight: '#14b8a6',
  primaryDark: '#115e59',

  // Status colors
  success: '#10b981',
  error: '#dc2626',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Status-specific (for itinerary status)
  planning: '#3b82f6',
  ongoing: '#10b981',
  completed: '#6b7280',

  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',

  // Text colors
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textLight: '#94a3b8',
  textWhite: '#ffffff',

  // Background colors
  bgPrimary: '#ffffff',
  bgSecondary: '#f8fafc',
  bgTertiary: '#f1f5f9',
  bgError: '#fee2e2',
  bgSuccess: '#d1fae5',

  // Border colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e1',
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const FONT_SIZES = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
};

export const FONT_WEIGHTS = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

export const BREAKPOINTS = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

export const Z_INDEX = {
  base: 1,
  dropdown: 10,
  modal: 100,
  tooltip: 200,
  notification: 300,
};

/**
 * Helper function to get status color
 * @param {string} status - planning, ongoing, or completed
 * @returns {string} Hex color code
 */
export function getStatusColor(status) {
  return COLORS[status] || COLORS.planning;
}

/**
 * Helper function to get status label
 * @param {string} status - planning, ongoing, or completed
 * @returns {string} Display label
 */
export function getStatusLabel(status) {
  const labels = {
    planning: 'Planning',
    ongoing: 'Ongoing',
    completed: 'Completed',
  };
  return labels[status] || status;
}
