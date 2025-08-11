import React from 'react';
import PropTypes from 'prop-types';
import './VoiceStatus.css';

const VoiceStatus = ({ isListening, isSpeaking, transcript, voiceSupported }) => {
  if (!voiceSupported) return null;

  return (
    <div className={`voice-status ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}>
      {isListening && (
        <div className="status-content">
          <div className="status-icon">🎤</div>
          <div className="status-text">
            <span className="status-label">Listening...</span>
            {transcript && (
              <span className="transcript-preview">"{transcript}"</span>
            )}
          </div>
          <div className="voice-waves">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>
      )}
      
      {isSpeaking && (
        <div className="status-content">
          <div className="status-icon">🔊</div>
          <div className="status-text">
            <span className="status-label">Speaking...</span>
          </div>
          <div className="speaking-indicator">
            <div className="speaker-wave"></div>
            <div className="speaker-wave"></div>
            <div className="speaker-wave"></div>
            <div className="speaker-wave"></div>
          </div>
        </div>
      )}
    </div>
  );
};

VoiceStatus.propTypes = {
  isListening: PropTypes.bool.isRequired,
  isSpeaking: PropTypes.bool.isRequired,
  transcript: PropTypes.string.isRequired,
  voiceSupported: PropTypes.bool.isRequired
};

export default VoiceStatus;
