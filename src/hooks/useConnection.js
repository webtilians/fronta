import { useState, useEffect, useCallback } from 'react';
import useApi from './useApi';

const useConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const { getHealth } = useApi();

  const checkConnection = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    try {
      await getHealth();
      setIsConnected(true);
      setConnectionError(null);
      console.log('✅ Conectado al servidor');
    } catch (error) {
      setIsConnected(false);
      setConnectionError(error.message);
      console.error('🚫 Error de conexión:', error);
    } finally {
      setIsChecking(false);
    }
  }, [getHealth, isChecking]);

  // Verificar conexión inicial y cada 30 segundos
  useEffect(() => {
    checkConnection();
    
    const interval = setInterval(() => {
      if (!isChecking) {
        checkConnection();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [checkConnection, isChecking]);

  const reconnect = useCallback(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    isConnected,
    connectionError,
    isChecking,
    reconnect,
    checkConnection
  };
};

export default useConnection;
