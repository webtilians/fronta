import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { validateMessage } from '../utils/constants';

const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Escribe tu mensaje..." }) => {
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    
    if (!validateMessage(text) || disabled || isComposing) {
      return;
    }

    onSendMessage(text);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const isValid = validateMessage(input);
  const canSend = isValid && !disabled && !isComposing;

  return (
    <form className="chat-input-area" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={disabled ? "Conectando..." : placeholder}
          disabled={disabled}
          autoFocus
          maxLength={1000}
          aria-label="Escribir mensaje"
        />
        <div className="char-counter" aria-live="polite">
          {input.length}/1000
        </div>
      </div>
      <button 
        type="submit" 
        disabled={!canSend}
        aria-label="Enviar mensaje"
        className={!canSend ? 'disabled' : ''}
      >
        <span className="button-text">Enviar</span>
        <span className="button-icon">📤</span>
      </button>
    </form>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default ChatInput;
