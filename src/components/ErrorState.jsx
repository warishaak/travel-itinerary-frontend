import React from 'react';
import { stateStyles } from '../styles/commonStyles';
import { buttonStyles } from '../styles/commonStyles';
import { parseApiError } from '../utils/apiErrors';

export function ErrorState({ error, onRetry, style = {} }) {
  const errorMessage = typeof error === 'string' ? error : parseApiError(error);

  return (
    <div style={{ ...stateStyles.error, ...style }}>
      <p>{errorMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{ ...buttonStyles.primary, marginTop: '16px' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
