export const TOOL_LABELS = {
  // Backend LangChain tools
  consultar_disponibilidad: 'Check availability',
  listar_tipos_habitaciones: 'List room types',
  crear_reserva: 'Create reservation',
  listar_reservas: 'List reservations',
  
  // Additional tools (legacy)
  cancelar_reserva: 'Cancel reservation',
  modificar_reserva: 'Modify reservation',
  consultar_servicios: 'Check hotel services',
  generar_factura: 'Generate invoice',
  
  // REST API simulation tools
  analyze_intent: 'Analyzing user intent',
  processing_request: 'Processing request',
  fetching_data: 'Fetching data from server',
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
