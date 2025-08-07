// src/components/Common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  };

  return (
    <div className={`loading-spinner-container ${sizeClasses[size]}`}>
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
