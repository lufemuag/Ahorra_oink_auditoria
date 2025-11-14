// src/config/security.js
// Configuración de seguridad para el frontend

export const SECURITY_CONFIG = {
  // Headers de seguridad que se aplicarán en producción
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'nonce-{nonce}'; style-src 'self' 'nonce-{nonce}'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' http://localhost:8000 http://127.0.0.1:8000; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; media-src 'self'; worker-src 'self'; manifest-src 'self'; upgrade-insecure-requests; block-all-mixed-content; frame-src 'none'",
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Server': 'WebServer'
  },
  
  // Configuración para ocultar información de desarrollo
  HIDE_DEV_INFO: process.env.NODE_ENV === 'production',
  
  // Configuración de CSP para desarrollo (más permisivo)
  CSP_DEV: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' http://localhost:8000 http://127.0.0.1:8000; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; media-src 'self'; worker-src 'self'; manifest-src 'self'; upgrade-insecure-requests; block-all-mixed-content; frame-src 'none'",
  
  // Configuración de CSP para producción (más estricto)
  CSP_PROD: "default-src 'self'; script-src 'self' 'nonce-{nonce}'; style-src 'self' 'nonce-{nonce}'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' http://localhost:8000 http://127.0.0.1:8000; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; media-src 'self'; worker-src 'self'; manifest-src 'self'; upgrade-insecure-requests; block-all-mixed-content; frame-src 'none'"
};

// Función para limpiar información de desarrollo
export const cleanDevInfo = () => {
  if (process.env.NODE_ENV === 'production') {
    // Eliminar console.log en producción
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    
    // Ocultar información de React DevTools
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => {};
    }
  }
};

// Función para generar nonce para CSP
export const generateNonce = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export default SECURITY_CONFIG;



