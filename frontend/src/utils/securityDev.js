// src/utils/securityDev.js
// Versión de seguridad para desarrollo - Sin restricciones

// Función para inicializar medidas de seguridad en desarrollo
export const initSecurity = () => {
  try {
    console.log('🔧 Modo desarrollo - Seguridad deshabilitada');
    console.log('✅ DevTools permitidos');
    console.log('✅ Console permitido');
    console.log('✅ Clic derecho permitido');
    console.log('✅ Selección de texto permitida');
    console.log('✅ Debugging permitido');
    
    // Solo mantener la encriptación de credenciales
    console.log('🔒 Encriptación de credenciales activa');
    
    // No ejecutar ninguna medida de seguridad restrictiva
    return true;
  } catch (error) {
    console.error('Error inicializando seguridad de desarrollo:', error);
    return false;
  }
};

// Funciones vacías para evitar errores
export const detectDevTools = () => {};
export const antiDebug = () => {};
export const validateIntegrity = () => {};
export const cleanSensitiveData = () => {};
export const detectTampering = () => {};
export const obfuscateString = (str) => str;
export const deobfuscateString = (str) => str;

export default {
  initSecurity,
  detectDevTools,
  antiDebug,
  validateIntegrity,
  cleanSensitiveData,
  detectTampering,
  obfuscateString,
  deobfuscateString
};
