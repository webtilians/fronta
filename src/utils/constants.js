export const TOOL_LABELS = {
  // Herramientas del backend LangChain
  consultar_disponibilidad: 'Consultar disponibilidad',
  listar_tipos_habitaciones: 'Listar tipos de habitaciones',
  crear_reserva: 'Crear reserva',
  listar_reservas: 'Listar reservas',
  
  // Herramientas adicionales (legacy)
  cancelar_reserva: 'Cancelar reserva',
  modificar_reserva: 'Modificar reserva',
  consultar_servicios: 'Consultar servicios del hotel',
  generar_factura: 'Generar factura',
  
  // Herramientas para simulación REST API
  analyze_intent: 'Analizando intención del usuario',
  processing_request: 'Procesando solicitud',
  fetching_data: 'Obteniendo datos del servidor',
};

export const getToolLabel = (tool) => {
  return TOOL_LABELS[tool] || tool;
};

export const API_ENDPOINTS = {
  CHAT: '/chat',
  HABITACIONES: '/habitaciones',
  RESERVAS: '/reservas',
  HEALTH: '/health',
  TEST: '/test',
};

export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  TOOL: 'tool',
  ERROR: 'error',
  SYSTEM: 'system',
};

export const CONNECTION_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
  CHECKING: 'checking',
};

export const validateMessage = (text) => {
  if (!text || typeof text !== 'string') return false;
  if (text.trim().length === 0) return false;
  if (text.length > 1000) return false;
  return true;
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const sanitizeText = (text) => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
