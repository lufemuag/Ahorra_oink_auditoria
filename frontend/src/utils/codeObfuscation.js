// src/utils/codeObfuscation.js
// Sistema de ofuscación de código JavaScript

class CodeObfuscator {
  constructor() {
    this.obfuscatedCode = new Map();
    this.originalCode = new Map();
    this.init();
  }

  init() {
    this.obfuscateGlobalObjects();
    this.obfuscateDOMMethods();
    this.obfuscateEventListeners();
    this.createFakeCode();
  }

  // Ofuscar objetos globales
  obfuscateGlobalObjects() {
    const globalObjects = [
      'document', 'window', 'navigator', 'location', 'history',
      'localStorage', 'sessionStorage', 'console', 'alert',
      'confirm', 'prompt', 'setTimeout', 'setInterval',
      'clearTimeout', 'clearInterval', 'fetch', 'XMLHttpRequest'
    ];

    globalObjects.forEach(obj => {
      if (window[obj]) {
        const obfuscatedName = this.generateObfuscatedName();
        this.originalCode.set(obfuscatedName, window[obj]);
        this.obfuscatedCode.set(obj, obfuscatedName);
        
        // Reemplazar con nombre ofuscado
        window[obfuscatedName] = window[obj];
        delete window[obj];
      }
    });
  }

  // Ofuscar métodos DOM
  obfuscateDOMMethods() {
    const domMethods = [
      'getElementById', 'getElementsByClassName', 'getElementsByTagName',
      'querySelector', 'querySelectorAll', 'createElement', 'appendChild',
      'removeChild', 'addEventListener', 'removeEventListener'
    ];

    if (document) {
      domMethods.forEach(method => {
        if (document[method]) {
          const obfuscatedName = this.generateObfuscatedName();
          this.originalCode.set(obfuscatedName, document[method]);
          this.obfuscatedCode.set(method, obfuscatedName);
          
          document[obfuscatedName] = document[method];
          delete document[method];
        }
      });
    }
  }

  // Ofuscar event listeners
  obfuscateEventListeners() {
    const events = [
      'click', 'load', 'DOMContentLoaded', 'resize', 'scroll',
      'keydown', 'keyup', 'mousedown', 'mouseup', 'contextmenu'
    ];

    events.forEach(event => {
      const obfuscatedName = this.generateObfuscatedName();
      this.obfuscatedCode.set(event, obfuscatedName);
    });
  }

  // Generar nombre ofuscado
  generateObfuscatedName() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$';
    let result = '';
    const length = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  // Crear código falso para confundir
  createFakeCode() {
    // Crear variables falsas
    const fakeVariables = [
      'userPassword', 'adminToken', 'secretKey', 'apiEndpoint',
      'databaseUrl', 'encryptionKey', 'sessionId', 'authToken'
    ];

    fakeVariables.forEach(varName => {
      const fakeValue = this.generateFakeValue();
      window[varName] = fakeValue;
    });

    // Crear funciones falsas
    const fakeFunctions = [
      'login', 'authenticate', 'encrypt', 'decrypt', 'validate',
      'processPayment', 'saveData', 'loadData', 'deleteUser'
    ];

    fakeFunctions.forEach(funcName => {
      window[funcName] = () => {
        throw new Error('Function not available');
      };
    });
  }

  // Generar valor falso
  generateFakeValue() {
    const types = ['string', 'number', 'boolean', 'object'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    switch (type) {
      case 'string':
        return this.generateRandomString();
      case 'number':
        return Math.floor(Math.random() * 1000000);
      case 'boolean':
        return Math.random() > 0.5;
      case 'object':
        return { fake: true, data: this.generateRandomString() };
      default:
        return null;
    }
  }

  // Generar string aleatorio
  generateRandomString() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const length = Math.floor(Math.random() * 20) + 10;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  // Obtener código original
  getOriginal(name) {
    return this.originalCode.get(name);
  }

  // Obtener nombre ofuscado
  getObfuscated(name) {
    return this.obfuscatedCode.get(name);
  }
}

// Inicializar ofuscador
let codeObfuscator = null;

export const initCodeObfuscation = () => {
  if (!codeObfuscator) {
    codeObfuscator = new CodeObfuscator();
  }
  return codeObfuscator;
};

export const getObfuscatedCode = () => {
  return codeObfuscator;
};

export default CodeObfuscator;
