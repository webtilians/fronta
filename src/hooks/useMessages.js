import { useState, useCallback } from 'react';

const STORAGE_KEY = 'hotel_chat_messages';

const useMessages = () => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error al cargar mensajes guardados:', error);
      return [];
    }
  });

  const addMessage = useCallback((message) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...message,
    };
    
    setMessages((prev) => {
      const updated = [...prev, newMessage];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error al guardar mensajes:', error);
      }
      return updated;
    });
  }, []);

  const removeToolMessages = useCallback(() => {
    setMessages((prev) => {
      const filtered = prev.filter((msg) => msg.sender !== 'tool');
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (error) {
        console.error('Error al guardar mensajes:', error);
      }
      return filtered;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error al limpiar mensajes:', error);
    }
  }, []);

  const getHistorial = useCallback(() => {
    return messages
      .filter((m) => m.sender === 'user' || m.sender === 'bot')
      .map((m) => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp,
      }));
  }, [messages]);

  return {
    messages,
    addMessage,
    removeToolMessages,
    clearMessages,
    getHistorial,
  };
};

export default useMessages;
