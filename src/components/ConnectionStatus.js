import React from 'react';
import PropTypes from 'prop-types';

const ConnectionStatus = ({ isConnected, connectionError }) => {
  if (connectionError) {
    return (
      <div className="connection-status error" role="alert" aria-live="polite">
        <span className="status-icon">🚫</span>
        <span className="status-text">Error de conexión</span>
        <span className="status-detail">{connectionError}</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="connection-status disconnected" role="status" aria-live="polite">
        <span className="status-icon">🔄</span>
        <span className="status-text">Conectando...</span>
      </div>
    );
  }

  return (
    <div className="connection-status connected" role="status" aria-live="polite">
      <span className="status-icon">✅</span>
      <span className="status-text">Conectado</span>
    </div>
  );
};

ConnectionStatus.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  connectionError: PropTypes.string,
};

export default ConnectionStatus;
