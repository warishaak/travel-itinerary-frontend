/**
 * LoadingState Component
 * Consistent loading UI across the application
 */

import React from 'react';
import { stateStyles } from '../styles/commonStyles';

export function LoadingState({ message = 'Loading...', style = {} }) {
  return (
    <div style={{ ...stateStyles.loading, ...style }}>
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;
