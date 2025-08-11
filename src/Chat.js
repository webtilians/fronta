import React, { useEffect, useRef, useState, useCallback } from 'react';
import useConnection from './hooks/useConnection';
import useMessages from './hooks/useMessages';
import useApi from './hooks/useApi';
import useVoice from './hooks/useVoice';
import useIOSViewport from './hooks/useIOSViewport';
import MessageItem from './components/MessageItem';
import ConnectionStatus from './components/ConnectionStatus';
import TypingIndicator from './components/TypingIndicator';
import ChatInput from './components/ChatInput';
import TestPanel from './components/TestPanel';
import VoiceStatus from './components/VoiceStatus';
import { MESSAGE_TYPES } from './utils/constants';
import './Chat.css';

function Chat() {
  const [isTyping, setIsTyping] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const messagesEndRef = useRef(null);
  const { isConnected, connectionError } = useConnection();
  const { messages, addMessage, addToolMessage, removeToolMessages, clearMessages, getHistorial } = useMessages();
  const { sendMessage, isLoading, error: apiError } = useApi();
  const { speak, isSpeaking, isListening, transcript, voiceSupported } = useVoice();
  
  // iOS viewport handling
  useIOSViewport();

  // Auto scroll to new message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Simulate tool usage based on question type
  const simulateToolUsage = useCallback((userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('availability') || message.includes('available')) {
      addToolMessage('Check availability');
      return 'consultar_disponibilidad';
    } else if (message.includes('reservation') || message.includes('reserve') || message.includes('book')) {
      addToolMessage('Create reservation');
      return 'crear_reserva';
    } else if (message.includes('rooms') || message.includes('types')) {
      addToolMessage('List room types');
      return 'listar_tipos_habitaciones';
    } else if (message.includes('list reservations') || message.includes('view reservations')) {
      addToolMessage('List reservations');
      return 'listar_reservas';
    } else {
      addToolMessage('Analyzing user intent');
      return 'analyze_intent';
    }
  }, [addToolMessage]);

  // Send message
  const handleSendMessage = useCallback(async (text) => {
    if (!isConnected || !text.trim() || isLoading) return;

    try {
      const historial = getHistorial();
      
      // Add user message
      addMessage({ 
        sender: MESSAGE_TYPES.USER, 
        text: text.trim() 
      });

      // Show typing indicator
      setIsTyping(true);

      // Simulate tool usage
      simulateToolUsage(text);
      
      // Small pause to show the tool
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send message to backend
      const response = await sendMessage(text.trim(), historial);
      
      // Clear tools
      removeToolMessages();
      
      // Add bot response
      if (response && response.response) {
        const botMessage = {
          sender: MESSAGE_TYPES.BOT,
          text: response.response
        };
        addMessage(botMessage);
        
        // Speak the bot response with enhanced naturalness
        setTimeout(() => speak(response.response), 300);
      } else if (response && response.mensaje) {
        const botMessage = {
          sender: MESSAGE_TYPES.BOT,
          text: response.mensaje
        };
        addMessage(botMessage);
        
        // Speak the bot response with enhanced naturalness
        setTimeout(() => speak(response.mensaje), 300);
      } else {
        const fallbackMessage = 'I received your message. How can I help you further?';
        addMessage({
          sender: MESSAGE_TYPES.BOT,
          text: fallbackMessage
        });
        
        // Speak the fallback message
        setTimeout(() => speak(fallbackMessage), 300);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Clear tools on error
      removeToolMessages();
      
      addMessage({
        sender: MESSAGE_TYPES.ERROR,
        text: `Error: ${error.message}. Please try again.`
      });
    } finally {
      setIsTyping(false);
    }
  }, [isConnected, isLoading, addMessage, removeToolMessages, getHistorial, sendMessage, simulateToolUsage, speak]);

  // Clear chat
  const handleClearChat = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the chat?')) {
      clearMessages();
      setIsTyping(false);
    }
  }, [clearMessages]);

  // Show API error if exists
  useEffect(() => {
    if (apiError) {
      addMessage({
        sender: MESSAGE_TYPES.ERROR,
        text: `API Error: ${apiError}`
      });
    }
  }, [apiError, addMessage]);

  return (
    <div className="chat-container" role="main" aria-label="Hotel assistant chat">
      <VoiceStatus 
        isListening={isListening}
        isSpeaking={isSpeaking}
        transcript={transcript}
        voiceSupported={voiceSupported}
      />
      
      <div className="chat-header">
        <ConnectionStatus 
          isConnected={isConnected} 
          connectionError={connectionError} 
        />
        <div className="chat-controls">
          <button
            className="toggle-timestamps"
            onClick={() => setShowTimestamps(!showTimestamps)}
            aria-label="Show/hide timestamps"
            title={showTimestamps ? 'Hide times' : 'Show times'}
          >
            🕒
          </button>
          <button
            className="test-panel-button"
            onClick={() => setShowTestPanel(true)}
            aria-label="Open test panel"
            title="API test panel"
          >
            🧪
          </button>
          <button
            className="clear-chat"
            onClick={handleClearChat}
            aria-label="Clear chat"
            title="Clear conversation"
          >
            🗑️
          </button>
        </div>
      </div>

      <div 
        className="chat-messages" 
        role="log" 
        aria-live="polite" 
        aria-label="Chat messages"
      >
        {messages.length === 0 && (
          <div className="welcome-message" role="article">
            <div className="welcome-icon">👋</div>
            <div className="welcome-text">
              Hello! I'm AselvIA, your Hotel "El Amanecer" assistant. 
              {voiceSupported ? (
                <span>
                  <br />You can type your message or use voice commands by clicking the microphone button. 
                  How can I help you today?
                </span>
              ) : (
                <span>How can I help you today?</span>
              )}
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageItem
            key={message.id || message.timestamp}
            message={message}
            showTimestamp={showTimestamps}
          />
        ))}
        
        <TypingIndicator isVisible={isTyping || isLoading} />
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!isConnected || isLoading}
        placeholder={
          !isConnected ? "No connection..." : 
          isLoading ? "Sending..." : 
          "Type your message..."
        }
      />
      
      <VoiceStatus 
        isListening={isListening}
        isSpeaking={isSpeaking}
        transcript={transcript}
        voiceSupported={voiceSupported}
      />
      
      <TestPanel 
        isOpen={showTestPanel} 
        onClose={() => setShowTestPanel(false)} 
      />
    </div>
  );
}

export default Chat;
