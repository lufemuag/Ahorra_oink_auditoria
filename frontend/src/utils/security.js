// src/utils/security.js
// Utilidades de seguridad para proteger el código frontend

import { initAntiInspection } from './antiInspection.js';
import { initCodeObfuscation } from './codeObfuscation.js';
import { initSourceProtection } from './sourceProtection.js';

// Función para ofuscar strings sensibles
export const obfuscateString = (str) => {
  if (!str) return '';
  
  // Convertir a base64 y luego aplicar rotación
  const base64 = btoa(str);
  const rotated = base64.split('').map(char => 
    String.fromCharCode(char.charCodeAt(0) + 3)
  ).join('');
  
  return btoa(rotated);
};

// Función para desofuscar strings
export const deobfuscateString = (obfuscated) => {
  if (!obfuscated) return '';
  
  try {
    const rotated = atob(obfuscated);
    const base64 = rotated.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) - 3)
    ).join('');
    
    return atob(base64);
  } catch (error) {
    console.error('Error deobfuscating string:', error);
    return '';
  }
};

// Función para detectar herramientas de desarrollo
export const detectDevTools = () => {
  const threshold = 160;
  const isProduction = import.meta.env.PROD || process.env.NODE_ENV === 'production';
  
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      
      if (isProduction) {
        // En producción: mostrar advertencia agresiva
        console.clear();
        console.log('%c¡ADVERTENCIA!', 'color: red; font-size: 50px; font-weight: bold;');
        console.log('%cEsta es una función del navegador destinada a desarrolladores.', 'color: red; font-size: 16px;');
        console.log('%cSi alguien le dijo que copie y pegue algo aquí para habilitar una función o "piratear" la cuenta de alguien, es una estafa.', 'color: red; font-size: 16px;');
        console.log('%cEsto le dará acceso a su cuenta a los estafadores.', 'color: red; font-size: 16px;');
      } else {
        // En desarrollo: solo mostrar mensaje informativo
        console.log('🔧 DevTools detectado - Modo desarrollo activo');
      }
    }
  }, 500);
};

// Función para proteger contra debugging
export const antiDebug = () => {
  const isProduction = import.meta.env.PROD || process.env.NODE_ENV === 'production';
  
  // Detectar breakpoints
  const checkDebugger = () => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    
    if (end - start > 100) {
      if (isProduction) {
        // Posible debugger activo - solo en producción
        window.location.href = 'about:blank';
      } else {
        console.log('🐛 Debugging detectado - Modo desarrollo');
      }
    }
  };
  
  // Ejecutar verificación periódicamente
  setInterval(checkDebugger, 1000);
  
  // Detectar console abierto
  let devtools = { open: false, orientation: null };
  const threshold = 160;
  
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        if (isProduction) {
          console.clear();
          console.log('%c¡ADVERTENCIA DE SEGURIDAD!', 'color: red; font-size: 30px; font-weight: bold;');
          console.log('%cEl acceso no autorizado a herramientas de desarrollo está prohibido.', 'color: red; font-size: 16px;');
        } else {
          console.log('🔧 DevTools detectado - Modo desarrollo');
        }
      }
    } else {
      devtools.open = false;
    }
  }, 500);
};

// Función para ofuscar código JavaScript dinámicamente
export const obfuscateCode = (code) => {
  // Reemplazar nombres de variables sensibles
  const sensitiveVars = [
    'password', 'token', 'secret', 'key', 'auth', 'login', 'user',
    'admin', 'api', 'database', 'config', 'settings'
  ];
  
  let obfuscatedCode = code;
  
  sensitiveVars.forEach((varName, index) => {
    const obfuscatedName = `_0x${index.toString(16).padStart(4, '0')}`;
    const regex = new RegExp(`\\b${varName}\\b`, 'gi');
    obfuscatedCode = obfuscatedCode.replace(regex, obfuscatedName);
  });
  
  return obfuscatedCode;
};

// Función para validar integridad del código
export const validateIntegrity = () => {
  // Verificar que no se hayan modificado funciones críticas
  const criticalFunctions = [
    'obfuscateString',
    'deobfuscateString',
    'detectDevTools',
    'antiDebug'
  ];
  
  criticalFunctions.forEach(funcName => {
    if (typeof window[funcName] !== 'function') {
      console.error(`Función crítica ${funcName} ha sido modificada o eliminada`);
      // Tomar acción de seguridad
      window.location.href = 'about:blank';
    }
  });
};

// Función para limpiar información sensible del DOM
export const cleanSensitiveData = () => {
  // Remover atributos que puedan contener información sensible
  const sensitiveAttributes = ['data-token', 'data-secret', 'data-key', 'data-auth'];
  
  document.querySelectorAll('*').forEach(element => {
    sensitiveAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });
  });
  
  // Limpiar localStorage de datos sensibles
  const sensitiveKeys = ['token', 'secret', 'key', 'auth', 'password'];
  sensitiveKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });
};

// Función para generar tokens seguros
export const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Función para encriptar datos locales
export const encryptLocalData = (data, key) => {
  try {
    const jsonString = JSON.stringify(data);
    const obfuscated = obfuscateString(jsonString);
    return obfuscated;
  } catch (error) {
    console.error('Error encrypting local data:', error);
    return null;
  }
};

// Función para desencriptar datos locales
export const decryptLocalData = (encryptedData, key) => {
  try {
    const deobfuscated = deobfuscateString(encryptedData);
    return JSON.parse(deobfuscated);
  } catch (error) {
    console.error('Error decrypting local data:', error);
    return null;
  }
};

// Función para detectar intentos de manipulación
export const detectTampering = () => {
  // Verificar que las funciones críticas no hayan sido sobrescritas
  const originalFunctions = {
    'console.log': console.log,
    'console.warn': console.warn,
    'console.error': console.error,
    'alert': window.alert,
    'confirm': window.confirm
  };
  
  Object.keys(originalFunctions).forEach(funcName => {
    if (window[funcName] !== originalFunctions[funcName]) {
      console.error(`Función ${funcName} ha sido sobrescrita`);
      // Restaurar función original
      window[funcName] = originalFunctions[funcName];
    }
  });
};

// Inicializar medidas de seguridad
export const initSecurity = () => {
  try {
    // Solo activar medidas agresivas en producción
    const isProduction = import.meta.env.PROD || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // Medidas de seguridad completas solo en producción
      initAntiInspection();
      initCodeObfuscation();
      initSourceProtection();
      
      // Limpiar información de desarrollo
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
      }
      
      // Deshabilitar herramientas de desarrollo
      Object.defineProperty(window, 'devtools', {
        get: () => false,
        set: () => {}
      });
      
      console.log('🔒 Medidas de seguridad completas activadas (PRODUCCIÓN)');
    } else {
      // En desarrollo: solo medidas básicas sin redireccionamientos
      console.log('🔒 Modo desarrollo - Seguridad básica activada');
      console.log('🔧 DevTools y debugging permitidos');
      
      // Solo validación de integridad y limpieza de datos
      validateIntegrity();
      cleanSensitiveData();
      detectTampering();
    }
  } catch (error) {
    console.error('Error inicializando medidas de seguridad:', error);
  }
};

export default {
  obfuscateString,
  deobfuscateString,
  detectDevTools,
  antiDebug,
  obfuscateCode,
  validateIntegrity,
  cleanSensitiveData,
  generateSecureToken,
  encryptLocalData,
  decryptLocalData,
  detectTampering,
  initSecurity
};
