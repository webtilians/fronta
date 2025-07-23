import React, { useEffect, useRef, useState, useCallback } from 'react';
import useSocket from './hooks/useSocket';
import useMessages from './hooks/useMessages';
import MessageItem from './components/MessageItem';
import ConnectionStatus from './components/ConnectionStatus';
import TypingIndicator from './components/TypingIndicator';
import ChatInput from './components/ChatInput';
import { SOCKET_EVENTS, MESSAGE_TYPES, getToolLabel } from './utils/constants';
import './Chat.css';

function Chat() {
  const [toolInUse, setToolInUse] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const messagesEndRef = useRef(null);
  const { isConnected, connectionError, emit, on, off } = useSocket();
  const { messages, addMessage, removeToolMessages, clearMessages, getHistorial } = useMessages();

  // Scroll automático al nuevo mensaje
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Manejo de eventos del socket
  useEffect(() => {
    if (!isConnected) return;

    // Mensaje del bot normal
    const handleBotMessage = (text) => {
      setIsTyping(false);
      addMessage({ 
        sender: MESSAGE_TYPES.BOT, 
        text: typeof text === 'string' ? text : text.message || 'Mensaje sin contenido'
      });
    };

    // Indicador de escritura
    const handleBotTyping = (data) => {
      setIsTyping(data?.typing ?? false);
    };

    // Evento para mostrar tool en uso - Mejorado para el nuevo backend
    const handleToolUsed = (data) => {
      if (data?.tool) {
        setToolInUse(data.tool);
        
        // Crear mensaje más informativo sobre la herramienta
        let toolMessage = `🛠️ Usando: ${getToolLabel(data.tool)}`;
        
        // Agregar información adicional si está disponible
        if (data.input) {
          const inputInfo = typeof data.input === 'object' ? 
            Object.entries(data.input)
              .filter(([key, value]) => value && value !== '')
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ') : 
            data.input;
          
          if (inputInfo) {
            toolMessage += `\nProcesando: ${inputInfo}`;
          }
        }
        
        addMessage({
          sender: MESSAGE_TYPES.TOOL,
          text: toolMessage,
          toolInfo: {
            tool: data.tool,
            input: data.input
          }
        });
      } else {
        // Borra el aviso del tool anterior
        setToolInUse(null);
        removeToolMessages();
      }
    };

    // Registrar event listeners
    on(SOCKET_EVENTS.BOT_MESSAGE, handleBotMessage);
    on(SOCKET_EVENTS.BOT_TYPING, handleBotTyping);
    on(SOCKET_EVENTS.TOOL_USED, handleToolUsed);

    // Cleanup
    return () => {
      off(SOCKET_EVENTS.BOT_MESSAGE, handleBotMessage);
      off(SOCKET_EVENTS.BOT_TYPING, handleBotTyping);
      off(SOCKET_EVENTS.TOOL_USED, handleToolUsed);
    };
  }, [isConnected, on, off, addMessage, removeToolMessages]);

  // Enviar mensaje
  const handleSendMessage = useCallback((text) => {
    if (!isConnected || !text.trim()) return;

    try {
      const historial = getHistorial();
      
      addMessage({ 
        sender: MESSAGE_TYPES.USER, 
        text: text.trim() 
      });

      emit(SOCKET_EVENTS.USER_MESSAGE, { 
        mensaje: text.trim(), 
        historial 
      });

      setIsTyping(true);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      addMessage({
        sender: MESSAGE_TYPES.ERROR,
        text: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.'
      });
    }
  }, [isConnected, emit, addMessage, getHistorial]);

  // Limpiar chat
  const handleClearChat = useCallback(() => {
    if (window.confirm('¿Estás seguro de que deseas limpiar el chat?')) {
      clearMessages();
      setToolInUse(null);
      setIsTyping(false);
    }
  }, [clearMessages]);

  return (
    <div className="chat-container" role="main" aria-label="Chat del asistente hotel">
      <div className="chat-header">
        <ConnectionStatus 
          isConnected={isConnected} 
          connectionError={connectionError} 
        />
        <div className="chat-controls">
          <button
            className="toggle-timestamps"
            onClick={() => setShowTimestamps(!showTimestamps)}
            aria-label="Mostrar/ocultar marcas de tiempo"
            title={showTimestamps ? 'Ocultar horas' : 'Mostrar horas'}
          >
            🕒
          </button>
          <button
            className="clear-chat"
            onClick={handleClearChat}
            aria-label="Limpiar chat"
            title="Limpiar conversación"
          >
            🗑️
          </button>
        </div>
      </div>

      <div 
        className="chat-messages" 
        role="log" 
        aria-live="polite" 
        aria-label="Mensajes del chat"
      >
        {messages.length === 0 && (
          <div className="welcome-message" role="article">
            <div className="welcome-icon">👋</div>
            <div className="welcome-text">
              ¡Hola! Soy AselvIA, tu asistente del Hotel "El Amanecer". 
              ¿En qué puedo ayudarte hoy?
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
        
        <TypingIndicator isVisible={isTyping} />
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!isConnected}
        placeholder={isConnected ? "Escribe tu mensaje..." : "Conectando..."}
      />
    </div>
  );
}

export default Chat;
