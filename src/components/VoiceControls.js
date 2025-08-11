import React from 'react';
import PropTypes from 'prop-types';
import './VoiceControls.css';

const VoiceControls = ({ 
  isListening, 
  isSpeaking, 
  voiceSupported, 
  onStartListening, 
  onStopListening, 
  onStopSpeaking 
}) => {
  if (!voiceSupported) {
    return null;
  }

  return (
    <div className="voice-controls">
      {/* Voice Input Button */}
      <button
        className={`voice-input-btn ${isListening ? 'listening' : ''}`}
        onClick={isListening ? onStopListening : onStartListening}
        disabled={isSpeaking}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        title={isListening ? 'Stop listening' : 'Click to speak'}
      >
        {isListening ? (
          <div className="listening-animation">
            <span className="pulse-ring"></span>
            <span className="pulse-ring delay-1"></span>
            <span className="pulse-ring delay-2"></span>
            🎤
          </div>
        ) : (
          '🎤'
        )}
      </button>

      {/* Stop Speaking Button */}
      {isSpeaking && (
        <button
          className="voice-stop-btn"
          onClick={onStopSpeaking}
          aria-label="Stop speaking"
          title="Stop voice playback"
        >
          🔇
        </button>
      )}

      {/* Voice Status Indicator */}
      {(isListening || isSpeaking) && (
        <div className="voice-status">
          {isListening && (
            <span className="status-text listening-text">
              <span className="status-dot"></span>
              Listening...
            </span>
          )}
          {isSpeaking && (
            <span className="status-text speaking-text">
              <span className="status-dot speaking"></span>
              Speaking...
            </span>
          )}
        </div>
      )}
    </div>
  );
};

VoiceControls.propTypes = {
  isListening: PropTypes.bool.isRequired,
  isSpeaking: PropTypes.bool.isRequired,
  voiceSupported: PropTypes.bool.isRequired,
  onStartListening: PropTypes.func.isRequired,
  onStopListening: PropTypes.func.isRequired,
  onStopSpeaking: PropTypes.func.isRequired,
};

export default VoiceControls;
