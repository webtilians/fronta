import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateMessage } from '../utils/constants';
import VoiceControls from './VoiceControls';
import useVoice from '../hooks/useVoice';

const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Type your message..." }) => {
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  
  const {
    isListening,
    isSpeaking,
    transcript,
    voiceSupported,
    startListening,
    stopListening,
    stopSpeaking,
    startConversation
  } = useVoice();

  // Enhanced voice transcript handling - simplified
  useEffect(() => {
    if (transcript && !isListening) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

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
    <div className="chat-input-container">
      <form className="chat-input-area" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={disabled ? "Connecting..." : placeholder}
            disabled={disabled}
            autoFocus
            maxLength={1000}
            aria-label="Type message"
            className={isListening ? 'listening' : ''}
          />
          <div className="char-counter" aria-live="polite">
            {input.length}/1000
          </div>
        </div>
        
        <div className="input-controls">
          <VoiceControls
            isListening={isListening}
            isSpeaking={isSpeaking}
            voiceSupported={voiceSupported}
            onStartListening={startListening}
            onStopListening={stopListening}
            onStopSpeaking={stopSpeaking}
          />
          
          {voiceSupported && (
            <button 
              type="button"
              onClick={startConversation}
              disabled={disabled}
              aria-label="Start voice conversation"
              className={`conversation-button ${isSpeaking ? 'speaking' : ''}`}
              title="Click to start voice conversation"
            >
              <span className="button-icon">🎙️</span>
            </button>
          )}
          
          <button 
            type="submit" 
            disabled={!canSend}
            aria-label="Send message"
            className={`send-button ${!canSend ? 'disabled' : ''}`}
          >
            <span className="button-text">Send</span>
            <span className="button-icon">📤</span>
          </button>
        </div>
      </form>
    </div>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default ChatInput;
