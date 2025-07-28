import { useState, useCallback } from 'react';

const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const apiCall = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = `${baseUrl}${endpoint}`;
      const config = {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        // Intentar obtener detalles específicos del error
        try {
          const errorData = await response.text();
          if (errorData) {
            errorMessage += `. Detalles: ${errorData}`;
          }
        } catch (e) {
          // Si no podemos leer el error, usar el mensaje general
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err.name === 'AbortError' 
        ? 'Timeout: La solicitud tomó demasiado tiempo'
        : `Error de conexión: ${err.message}`;
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  const sendMessage = useCallback(async (mensaje, historial = []) => {
    // Asegurar que tenemos un session_id
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
    }

    // Formato exacto que espera el backend FastAPI, with English instruction
    const payload = {
      message: `Please respond in English. ${mensaje}`,
      session_id: sessionId
    };

    return await apiCall('/chat', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }, [apiCall]);

  const getHabitaciones = useCallback(async () => {
    return await apiCall('/habitaciones');
  }, [apiCall]);

  const getReservas = useCallback(async () => {
    return await apiCall('/reservas');
  }, [apiCall]);

  const getHealth = useCallback(async () => {
    return await apiCall('/health');
  }, [apiCall]);

  const generateSessionId = () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
    return sessionId;
  };

  return {
    isLoading,
    error,
    sendMessage,
    getHabitaciones,
    getReservas,
    getHealth,
    clearError: () => setError(null)
  };
};

export default useApi;
