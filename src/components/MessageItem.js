import React from 'react';
import PropTypes from 'prop-types';
import { formatTimestamp } from '../utils/constants';

const MessageItem = React.memo(({ message, showTimestamp = false }) => {
  const getMessageClass = () => {
    switch (message.sender) {
      case 'user':
        return 'message user';
      case 'tool':
        return 'message bot tool-used';
      case 'error':
        return 'message bot error';
      case 'system':
        return 'message system';
      default:
        return 'message bot';
    }
  };

  return (
    <div className={getMessageClass()} role="article" aria-label={`Mensaje de ${message.sender}`}>
      <div className="message-content">
        {message.text}
      </div>
      {showTimestamp && message.timestamp && (
        <div className="message-timestamp" aria-label="Hora del mensaje">
          {formatTimestamp(message.timestamp)}
        </div>
      )}
    </div>
  );
});

MessageItem.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sender: PropTypes.oneOf(['user', 'bot', 'tool', 'error', 'system']).isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
  }).isRequired,
  showTimestamp: PropTypes.bool,
};

MessageItem.displayName = 'MessageItem';

export default MessageItem;
