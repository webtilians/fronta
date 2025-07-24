import React, { useEffect, useRef, useState, useCallback } from 'react';
import useConnection from './hooks/useConnection';
import useMessages from './hooks/useMessages';
import useApi from './hooks/useApi';
import MessageItem from './components/MessageItem';
import ConnectionStatus from './components/ConnectionStatus';
import TypingIndicator from './components/TypingIndicator';
import ChatInput from './components/ChatInput';
import TestPanel from './components/TestPanel';
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

  // Simular el uso de herramientas basado en el tipo de pregunta
  const simulateToolUsage = useCallback((userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('disponibilidad') || message.includes('disponible')) {
      addToolMessage('Consultar disponibilidad');
      return 'consultar_disponibilidad';
    } else if (message.includes('reserva') || message.includes('reservar')) {
      addToolMessage('Crear reserva');
      return 'crear_reserva';
    } else if (message.includes('habitaciones') || message.includes('tipos')) {
      addToolMessage('Listar tipos de habitaciones');
      return 'listar_tipos_habitaciones';
    } else if (message.includes('listar reservas') || message.includes('ver reservas')) {
      addToolMessage('Listar reservas');
      return 'listar_reservas';
    } else {
      addToolMessage('Analizando intención del usuario');
      return 'analyze_intent';
    }
  }, [addToolMessage]);

  // Enviar mensaje
  const handleSendMessage = useCallback(async (text) => {
    if (!isConnected || !text.trim() || isLoading) return;

    try {
      const historial = getHistorial();
      
      // Agregar mensaje del usuario
      addMessage({ 
        sender: MESSAGE_TYPES.USER, 
        text: text.trim() 
      });

      // Mostrar indicador de escritura
      setIsTyping(true);

      // Simular uso de herramienta
      simulateToolUsage(text);
      
      // Pequeña pausa para mostrar la herramienta
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Enviar mensaje al backend
      const response = await sendMessage(text.trim(), historial);
      
      // Limpiar herramientas
      removeToolMessages();
      
      // Agregar respuesta del bot
      if (response && response.response) {
        addMessage({
          sender: MESSAGE_TYPES.BOT,
          text: response.response
        });
      } else if (response && response.mensaje) {
        addMessage({
          sender: MESSAGE_TYPES.BOT,
          text: response.mensaje
        });
      } else {
        addMessage({
          sender: MESSAGE_TYPES.BOT,
          text: 'Respuesta recibida del servidor'
        });
      }

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Limpiar herramientas en caso de error
      removeToolMessages();
      
      addMessage({
        sender: MESSAGE_TYPES.ERROR,
        text: `Error: ${error.message}. Por favor, inténtalo de nuevo.`
      });
    } finally {
      setIsTyping(false);
    }
  }, [isConnected, isLoading, addMessage, removeToolMessages, getHistorial, sendMessage, simulateToolUsage]);

  // Limpiar chat
  const handleClearChat = useCallback(() => {
    if (window.confirm('¿Estás seguro de que deseas limpiar el chat?')) {
      clearMessages();
      setIsTyping(false);
    }
  }, [clearMessages]);

  // Mostrar error de API si existe
  useEffect(() => {
    if (apiError) {
      addMessage({
        sender: MESSAGE_TYPES.ERROR,
        text: `Error de API: ${apiError}`
      });
    }
  }, [apiError, addMessage]);

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
            className="test-panel-button"
            onClick={() => setShowTestPanel(true)}
            aria-label="Abrir panel de pruebas"
            title="Panel de pruebas API"
          >
            🧪
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
        
        <TypingIndicator isVisible={isTyping || isLoading} />
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!isConnected || isLoading}
        placeholder={
          !isConnected ? "Sin conexión..." : 
          isLoading ? "Enviando..." : 
          "Escribe tu mensaje..."
        }
      />
      
      <TestPanel 
        isOpen={showTestPanel} 
        onClose={() => setShowTestPanel(false)} 
      />
    </div>
  );
}

export default Chat;
