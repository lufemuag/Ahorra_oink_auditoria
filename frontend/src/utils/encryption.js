// src/utils/encryption.js
// Utilidades de encriptación para proteger credenciales en tránsito

// Clave de encriptación (en producción debería venir del servidor)
const ENCRYPTION_KEY = 'ahorra-oink-secure-key-2025';

// Función para generar un hash simple pero efectivo
const generateHash = (str) => {
  let hash = BigInt(0);
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = BigInt(str.charCodeAt(i));
    hash = ((hash << BigInt(5)) - hash) + char;
  }
  
  // Usar exactamente la misma lógica que el backend: hex(abs(hash_val))[2:]
  return (hash < 0 ? -hash : hash).toString(16);
};

// Función para encriptar texto usando cifrado simple pero efectivo
const encryptText = (text, key) => {
  if (!text) return '';
  
  const keyHash = generateHash(key);
  const keyNum = parseInt(keyHash.substring(0, 8), 16) || 1;
  
  let encrypted = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Usar un shift más simple y predecible
    const shift = (keyNum + i) % 95; // Usar módulo 95 para caracteres imprimibles
    
    // Aplicar el shift a todos los caracteres de manera uniforme
    const newCode = (charCode - 32 + shift) % 95 + 32;
    encrypted += String.fromCharCode(newCode);
  }
  
  return encrypted;
};

// Función para desencriptar texto
const decryptText = (encryptedText, key) => {
  if (!encryptedText) return '';
  
  const keyHash = generateHash(key);
  const keyNum = parseInt(keyHash.substring(0, 8), 16) || 1;
  
  let decrypted = '';
  for (let i = 0; i < encryptedText.length; i++) {
    const charCode = encryptedText.charCodeAt(i);
    // Usar el mismo shift que en la encriptación
    const shift = (keyNum + i) % 95; // Usar módulo 95 para caracteres imprimibles
    
    // Revertir el shift aplicado en la encriptación
    const originalCode = (charCode - 32 - shift + 95) % 95 + 32;
    decrypted += String.fromCharCode(originalCode);
  }
  
  return decrypted;
};

// Función para encriptar credenciales de login
export const encryptCredentials = (username, password) => {
  try {
    // Crear un timestamp para hacer la encriptación única
    const timestamp = Date.now().toString();
    const combinedKey = ENCRYPTION_KEY + timestamp;
    
    // Encriptar username y password
    const encryptedUsername = encryptText(username, combinedKey);
    const encryptedPassword = encryptText(password, combinedKey);
    
    // Crear payload encriptado
    const encryptedPayload = {
      u: encryptedUsername, // username encriptado
      p: encryptedPassword, // password encriptado
      t: timestamp,         // timestamp para desencriptación
      k: generateHash(combinedKey).substring(0, 8) // clave de verificación
    };
    
    return encryptedPayload;
  } catch (error) {
    console.error('Error encrypting credentials:', error);
    return null;
  }
};

// Función para desencriptar credenciales (para el backend)
export const decryptCredentials = (encryptedPayload) => {
  try {
    if (!encryptedPayload || !encryptedPayload.u || !encryptedPayload.p || !encryptedPayload.t) {
      return null;
    }
    
    const timestamp = encryptedPayload.t;
    const combinedKey = ENCRYPTION_KEY + timestamp;
    
    // Verificar la clave de verificación
    const expectedKey = generateHash(combinedKey).substring(0, 8);
    if (encryptedPayload.k !== expectedKey) {
      console.error('Invalid encryption key');
      return null;
    }
    
    // Desencriptar username y password
    const username = decryptText(encryptedPayload.u, combinedKey);
    const password = decryptText(encryptedPayload.p, combinedKey);
    
    return {
      username,
      password
    };
  } catch (error) {
    console.error('Error decrypting credentials:', error);
    return null;
  }
};

// Función para encriptar cualquier objeto de datos
export const encryptData = (data, customKey = null) => {
  try {
    const key = customKey || ENCRYPTION_KEY;
    const jsonString = JSON.stringify(data);
    const encrypted = encryptText(jsonString, key);
    
    return {
      data: encrypted,
      key: generateHash(key).substring(0, 8)
    };
  } catch (error) {
    console.error('Error encrypting data:', error);
    return null;
  }
};

// Función para desencriptar cualquier objeto de datos
export const decryptData = (encryptedData, customKey = null) => {
  try {
    const key = customKey || ENCRYPTION_KEY;
    const expectedKey = generateHash(key).substring(0, 8);
    
    if (encryptedData.key !== expectedKey) {
      console.error('Invalid decryption key');
      return null;
    }
    
    const decrypted = decryptText(encryptedData.data, key);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

// Función para generar un token de sesión seguro
export const generateSessionToken = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  const combined = timestamp + random;
  
  return generateHash(combined);
};

// Función para validar la integridad de los datos encriptados
export const validateEncryptedData = (encryptedData) => {
  try {
    if (!encryptedData || typeof encryptedData !== 'object') {
      return false;
    }
    
    // Verificar que tenga los campos necesarios
    const requiredFields = ['u', 'p', 't', 'k'];
    for (const field of requiredFields) {
      if (!encryptedData[field]) {
        return false;
      }
    }
    
    // Verificar que el timestamp sea válido (no muy antiguo)
    const timestamp = parseInt(encryptedData.t);
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutos
    
    if (now - timestamp > maxAge) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating encrypted data:', error);
    return false;
  }
};

// Función para limpiar datos sensibles de la memoria
export const clearSensitiveData = () => {
  // Limpiar variables sensibles
  if (typeof window !== 'undefined') {
    delete window._tempCredentials;
    delete window._tempEncryptedData;
  }
  
  // Forzar garbage collection si está disponible
  if (typeof window !== 'undefined' && window.gc) {
    window.gc();
  }
};

export default {
  encryptCredentials,
  decryptCredentials,
  encryptData,
  decryptData,
  generateSessionToken,
  validateEncryptedData,
  clearSensitiveData
};
