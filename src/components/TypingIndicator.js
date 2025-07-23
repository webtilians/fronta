import React from 'react';
import PropTypes from 'prop-types';

const TypingIndicator = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="typing-indicator" role="status" aria-label="El asistente está escribiendo">
      <div className="typing-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <span className="typing-text">AselvIA está escribiendo...</span>
    </div>
  );
};

TypingIndicator.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default TypingIndicator;
