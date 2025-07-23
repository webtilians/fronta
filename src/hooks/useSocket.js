import { useRef, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const connect = useCallback(() => {
    try {
      const url = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000';
      
      socketRef.current = io(url, {
        transports: ['websocket'],
        secure: process.env.NODE_ENV === 'production',
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        setConnectionError(null);
        console.log('✅ Conectado al servidor');
      });

      socketRef.current.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log('❌ Desconectado del servidor:', reason);
      });

      socketRef.current.on('connect_error', (error) => {
        setConnectionError(`Error de conexión: ${error.message}`);
        setIsConnected(false);
        console.error('🚫 Error de conexión:', error);
      });

      socketRef.current.on('reconnect', (attemptNumber) => {
        console.log(`🔄 Reconectado después de ${attemptNumber} intentos`);
        setIsConnected(true);
        setConnectionError(null);
      });

      socketRef.current.on('reconnect_error', (error) => {
        console.error('🚫 Error de reconexión:', error);
      });

    } catch (error) {
      setConnectionError(`Error al inicializar socket: ${error.message}`);
      console.error('🚫 Error al inicializar socket:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('⚠️ Socket no conectado. No se puede enviar mensaje.');
    }
  }, [isConnected]);

  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
};

export default useSocket;
