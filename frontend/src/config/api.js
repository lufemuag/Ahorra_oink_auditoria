// Configuración de la API para conectar con el backend
const API_CONFIG = {
  // URL base del backend Django
  BASE_URL: 'http://localhost:8000',
  
  // Endpoints de la API
  ENDPOINTS: {
    // Autenticación
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/register/',
    LOGOUT: '/api/auth/logout/',
    REFRESH: '/api/auth/refresh/',
    
    // Usuarios
    USERS: '/api/users/',
    PROFILE: '/api/auth/me/',
    PROFILE_UPDATE: '/api/auth/me/detail/',
    CHANGE_PASSWORD: '/api/auth/me/change-password/',
    
    // Transacciones
    TRANSACTIONS: '/api/transactions/',
    INCOMES: '/api/transactions/incomes/',
    EXPENSES: '/api/transactions/expenses/',
    
    // Categorías
    CATEGORIES: '/api/categories/',
    
    // Metas de ahorro
    SAVINGS_GOALS: '/api/savings-goals/',
    
    // Logros
    ACHIEVEMENTS: '/api/achievements/',
    
    // Notificaciones
    NOTIFICATIONS: '/api/notifications/',
  },
  
  // Configuración de headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Timeout para las peticiones
  TIMEOUT: 10000,
};

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener headers con autenticación
export const getAuthHeaders = (token) => {
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`,
  };
};

export default API_CONFIG;
