export const TOOL_LABELS = {
  consultar_disponibilidad: 'Consultar disponibilidad',
  crear_reserva: 'Crear reserva',
  listar_tipos_habitaciones: 'Listar tipos de habitaciones',
  listar_reservas: 'Listar reservas',
  cancelar_reserva: 'Cancelar reserva',
  modificar_reserva: 'Modificar reserva',
  consultar_servicios: 'Consultar servicios del hotel',
  generar_factura: 'Generar factura',
  // Añadir herramientas específicas del backend
  listar_tipos: 'Obtener catálogo de habitaciones',
  analyze_intent: 'Analizando intención del usuario',
  handle_specific_availability: 'Verificando disponibilidad específica',
  handle_general_availability: 'Consultando disponibilidad general',
  handle_reservation_request: 'Procesando solicitud de reserva',
  handle_room_types_query: 'Consultando tipos de habitaciones',
  handle_list_reservations: 'Listando reservas existentes',
};

export const getToolLabel = (tool) => {
  return TOOL_LABELS[tool] || tool;
};

export const SOCKET_EVENTS = {
  BOT_MESSAGE: 'bot-message',
  TOOL_USED: 'tool-used',
  BOT_TYPING: 'bot-typing',
  USER_MESSAGE: 'user_message',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  RECONNECT: 'reconnect',
  RECONNECT_ERROR: 'reconnect_error',
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
  RECONNECTING: 'reconnecting',
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
