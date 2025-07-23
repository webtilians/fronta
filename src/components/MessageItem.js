import React from 'react';
import PropTypes from 'prop-types';
import { formatTimestamp } from '../utils/constants';

const MessageItem = React.memo(({ message, showTimestamp = false }) => {
  const getMessageClass = () => {
    switch (message.sender) {
      case 'user':
        return 'message user';
      case 'tool':
        return 'message tool-used';
      case 'error':
        return 'message bot error';
      case 'system':
        return 'message system';
      default:
        return 'message bot';
    }
  };

  const renderToolMessage = () => {
    if (message.sender !== 'tool') return message.text;
    
    // Extraer información de la herramienta si está disponible
    const toolInfo = message.toolInfo || {};
    
    return (
      <div className="tool-content">
        <div className="tool-header">
          <span className="tool-icon">🛠️</span>
          <span className="tool-text">{message.text}</span>
        </div>
        {toolInfo.input && (
          <div className="tool-details">
            <strong>Parámetros:</strong> {JSON.stringify(toolInfo.input, null, 2)}
          </div>
        )}
      </div>
    );
  };

  const renderBotMessage = () => {
    if (message.sender !== 'bot') return message.text;
    
    // Formatear texto del bot con markdown básico
    let formattedText = message.text;
    
    // Convertir **texto** a negrita
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convertir emojis de lista en elementos HTML
    formattedText = formattedText.replace(/^([🏨🛏️📝💰🏠📅👤📧📞👥🎫🔄❌✅📋])/gm, '<span class="emoji-bullet">$1</span>');
    
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  const renderMessageContent = () => {
    if (message.sender === 'tool') {
      return renderToolMessage();
    } else if (message.sender === 'bot') {
      return renderBotMessage();
    } else {
      return message.text;
    }
  };

  return (
    <div className={getMessageClass()} role="article" aria-label={`Mensaje de ${message.sender}`}>
      <div className="message-content">
        {renderMessageContent()}
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
    toolInfo: PropTypes.object,
  }).isRequired,
  showTimestamp: PropTypes.bool,
};

MessageItem.displayName = 'MessageItem';

export default MessageItem;
