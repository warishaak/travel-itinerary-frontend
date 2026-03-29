/**
 * Common Styles Module
 * Shared style objects for consistent UI across the application
 * Used primarily for auth forms and common layouts
 */

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS, FONT_WEIGHTS } from '../constants/theme';

/**
 * Auth form styles
 * Used by: Login, Register, ForgotPassword, ResetPassword
 */
export const authFormStyles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgSecondary,
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.lg,
    padding: SPACING.xxl,
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
  },
  input: {
    width: '100%',
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    transition: 'border-color 0.2s',
  },
  inputFocus: {
    outline: 'none',
    borderColor: COLORS.primary,
  },
  button: {
    width: '100%',
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    border: 'none',
    borderRadius: BORDER_RADIUS.md,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    backgroundColor: COLORS.primaryHover,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray400,
    cursor: 'not-allowed',
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  success: {
    backgroundColor: COLORS.bgSuccess,
    color: COLORS.success,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  link: {
    color: COLORS.primary,
    textDecoration: 'none',
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginTop: SPACING.md,
    display: 'block',
  },
  linkHover: {
    textDecoration: 'underline',
  },
};

/**
 * Page container styles
 * Used by: ItineraryList, Profile, PublicTrips
 */
export const pageContainerStyles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.bgSecondary,
    paddingBottom: SPACING.xxl,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: SPACING.lg,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
};

/**
 * Card styles
 * Used by: ItineraryCard and other list items
 */
export const cardStyles = {
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.base,
    padding: SPACING.lg,
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: SHADOWS.lg,
  },
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  cardText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
};

/**
 * Button styles
 * Standard buttons used throughout the app
 */
export const buttonStyles = {
  primary: {
    padding: `${SPACING.sm} ${SPACING.lg}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    border: 'none',
    borderRadius: BORDER_RADIUS.md,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondary: {
    padding: `${SPACING.sm} ${SPACING.lg}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
    backgroundColor: COLORS.white,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: BORDER_RADIUS.md,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  danger: {
    padding: `${SPACING.sm} ${SPACING.lg}`,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    backgroundColor: COLORS.error,
    border: 'none',
    borderRadius: BORDER_RADIUS.md,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  small: {
    padding: `${SPACING.xs} ${SPACING.md}`,
    fontSize: FONT_SIZES.sm,
  },
  large: {
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: FONT_SIZES.lg,
  },
};

/**
 * Form styles
 * General form elements
 */
export const formStyles = {
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    display: 'block',
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  input: {
    width: '100%',
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    transition: 'border-color 0.2s',
    minHeight: '100px',
    resize: 'vertical',
  },
  select: {
    width: '100%',
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: SPACING.xs,
    cursor: 'pointer',
  },
  errorMessage: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  helpText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
};

/**
 * Badge styles
 * Used for status badges and tags
 */
export const badgeStyles = {
  base: {
    display: 'inline-block',
    padding: `${SPACING.xs} ${SPACING.md}`,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    borderRadius: BORDER_RADIUS.full,
    textTransform: 'capitalize',
  },
  planning: {
    backgroundColor: COLORS.planning,
    color: COLORS.white,
  },
  ongoing: {
    backgroundColor: COLORS.ongoing,
    color: COLORS.white,
  },
  completed: {
    backgroundColor: COLORS.completed,
    color: COLORS.white,
  },
};

/**
 * Loading/Empty state styles
 */
export const stateStyles = {
  loading: {
    textAlign: 'center',
    padding: SPACING.xxl,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.lg,
  },
  error: {
    textAlign: 'center',
    padding: SPACING.xxl,
    color: COLORS.error,
    fontSize: FONT_SIZES.base,
  },
  empty: {
    textAlign: 'center',
    padding: SPACING.xxl,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.base,
  },
};
