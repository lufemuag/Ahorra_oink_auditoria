// src/utils/securityConfig.js
// Configuración de seguridad avanzada

export const SECURITY_CONFIG = {
  // Configuración de anti-inspection
  ANTI_INSPECTION: {
    enabled: true,
    devToolsDetection: true,
    consoleBlocking: true,
    rightClickBlocking: true,
    keyboardShortcutsBlocking: true,
    textSelectionBlocking: true,
    warningMessage: '🔒 Acceso Denegado - Las herramientas de desarrollador no están permitidas'
  },

  // Configuración de ofuscación
  OBFUSCATION: {
    enabled: true,
    globalObjects: true,
    domMethods: true,
    eventListeners: true,
    fakeCodeGeneration: true,
    variableNameObfuscation: true
  },

  // Configuración de protección de fuentes
  SOURCE_PROTECTION: {
    enabled: true,
    hideSourceMaps: true,
    fakeSourceGeneration: true,
    sourceFileBlocking: true,
    requestInterception: true
  },

  // Configuración de encriptación
  ENCRYPTION: {
    enabled: true,
    loginCredentials: true,
    sensitiveData: true,
    localStorage: true,
    sessionStorage: true
  },

  // Configuración de detección
  DETECTION: {
    devToolsCheckInterval: 500,
    manipulationCheckInterval: 1000,
    integrityCheckInterval: 2000,
    maxWarningCount: 3
  },

  // Configuración de respuesta
  RESPONSE: {
    redirectOnDetection: true,
    clearPageOnDetection: true,
    showWarningMessages: true,
    blockNavigation: true
  }
};

// Función para verificar si la seguridad está habilitada
export const isSecurityEnabled = () => {
  return SECURITY_CONFIG.ANTI_INSPECTION.enabled ||
         SECURITY_CONFIG.OBFUSCATION.enabled ||
         SECURITY_CONFIG.SOURCE_PROTECTION.enabled ||
         SECURITY_CONFIG.ENCRYPTION.enabled;
};

// Función para obtener configuración específica
export const getSecurityConfig = (category) => {
  return SECURITY_CONFIG[category] || {};
};

// Función para actualizar configuración
export const updateSecurityConfig = (category, config) => {
  if (SECURITY_CONFIG[category]) {
    SECURITY_CONFIG[category] = { ...SECURITY_CONFIG[category], ...config };
  }
};

export default SECURITY_CONFIG;
