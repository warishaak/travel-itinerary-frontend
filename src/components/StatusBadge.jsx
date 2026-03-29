import React from 'react';
import { getStatusLabel, getStatusColor } from '../utils/itinerary';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/theme';

export function StatusBadge({ status }) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  const styles = {
    badge: {
      display: 'inline-block',
      padding: `${SPACING.xs} ${SPACING.md}`,
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.semibold,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: color,
      color: '#ffffff',
      textTransform: 'capitalize',
    },
  };

  return <span style={styles.badge}>{label}</span>;
}

export default StatusBadge;
