// src/utils/sourceProtection.js
// Sistema de protección de archivos fuente

class SourceProtector {
  constructor() {
    this.protectedFiles = new Set();
    this.fakeSources = new Map();
    this.init();
  }

  init() {
    this.hideSourceMaps();
    this.createFakeSources();
    this.protectSourceFiles();
    this.disableSourceAccess();
  }

  // Ocultar source maps
  hideSourceMaps() {
    // Eliminar referencias a source maps
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      if (script.src.includes('.map')) {
        script.remove();
      }
    });

    // Eliminar comentarios de source map
    const styleSheets = document.querySelectorAll('style, link[rel="stylesheet"]');
    styleSheets.forEach(sheet => {
      if (sheet.textContent && sheet.textContent.includes('sourceMappingURL')) {
        sheet.textContent = sheet.textContent.replace(/\/\*# sourceMappingURL=.*\*\//g, '');
      }
    });
  }

  // Crear fuentes falsas
  createFakeSources() {
    const fakeFiles = [
      'main.js', 'app.js', 'index.js', 'utils.js', 'components.js',
      'services.js', 'auth.js', 'api.js', 'config.js', 'constants.js'
    ];

    fakeFiles.forEach(file => {
      const fakeContent = this.generateFakeFileContent(file);
      this.fakeSources.set(file, fakeContent);
    });
  }

  // Generar contenido falso de archivo
  generateFakeFileContent(filename) {
    const fakeCode = `
// ${filename} - Archivo protegido
// Este archivo contiene código confidencial
// Acceso denegado por motivos de seguridad

(function() {
  'use strict';
  
  // Variables confidenciales
  const _0x1a2b = 'confidential_data';
  const _0x3c4d = 'secret_key';
  const _0x5e6f = 'admin_password';
  
  // Funciones de seguridad
  function _0x7g8h() {
    throw new Error('Access denied');
  }
  
  function _0x9i0j() {
    return 'This is fake code';
  }
  
  // Exportar funciones falsas
  window.${filename.replace('.js', '')} = {
    init: _0x7g8h,
    load: _0x9i0j,
    process: _0x7g8h
  };
})();
    `;
    
    return fakeCode;
  }

  // Proteger archivos fuente
  protectSourceFiles() {
    // Interceptar requests a archivos fuente
    const originalFetch = window.fetch;
    window.fetch = (url, options) => {
      if (this.isSourceFile(url)) {
        return this.handleSourceRequest(url);
      }
      return originalFetch(url, options);
    };

    // Interceptar XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      
      xhr.open = function(method, url, ...args) {
        if (this.isSourceFile(url)) {
          return this.handleSourceRequest(url);
        }
        return originalOpen.call(this, method, url, ...args);
      }.bind(this);
      
      return xhr;
    }.bind(this);
  }

  // Verificar si es archivo fuente
  isSourceFile(url) {
    const sourceExtensions = ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.sass'];
    const sourcePatterns = ['/src/', '/components/', '/utils/', '/services/', '/pages/'];
    
    return sourceExtensions.some(ext => url.includes(ext)) ||
           sourcePatterns.some(pattern => url.includes(pattern));
  }

  // Manejar request a archivo fuente
  handleSourceRequest(url) {
    const filename = url.split('/').pop();
    
    if (this.fakeSources.has(filename)) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(this.fakeSources.get(filename)),
        json: () => Promise.resolve({ error: 'Access denied' })
      });
    }
    
    return Promise.resolve({
      ok: false,
      status: 403,
      text: () => Promise.resolve('Access denied'),
      json: () => Promise.resolve({ error: 'Access denied' })
    });
  }

  // Deshabilitar acceso a fuentes
  disableSourceAccess() {
    // Sobrescribir métodos de inspección
    const originalToString = Function.prototype.toString;
    Function.prototype.toString = function() {
      return 'function() { [native code] }';
    };

    // Sobrescribir console.trace
    if (console.trace) {
      console.trace = function() {
        throw new Error('Stack trace access denied');
      };
    }

    // Deshabilitar acceso a propiedades del objeto
    const originalGetOwnPropertyNames = Object.getOwnPropertyNames;
    Object.getOwnPropertyNames = function(obj) {
      if (obj === window || obj === document) {
        return [];
      }
      return originalGetOwnPropertyNames(obj);
    };
  }

  // Agregar archivo protegido
  protectFile(filename) {
    this.protectedFiles.add(filename);
  }

  // Verificar si archivo está protegido
  isProtected(filename) {
    return this.protectedFiles.has(filename);
  }
}

// Inicializar protector
let sourceProtector = null;

export const initSourceProtection = () => {
  if (!sourceProtector) {
    sourceProtector = new SourceProtector();
  }
  return sourceProtector;
};

export const getSourceProtector = () => {
  return sourceProtector;
};

export default SourceProtector;
