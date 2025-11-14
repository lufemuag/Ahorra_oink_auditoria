// src/utils/antiInspection.js
// Sistema de protección contra inspección y debugging

class AntiInspection {
  constructor() {
    this.isDevToolsOpen = false;
    this.devToolsCheckInterval = null;
    this.consoleWarnings = [];
    this.originalConsole = {};
    this.init();
  }

  init() {
    this.backupConsole();
    this.disableConsole();
    this.detectDevTools();
    this.disableRightClick();
    this.disableKeyboardShortcuts();
    this.disableTextSelection();
    this.obfuscateCode();
    this.detectInspection();
    this.startPeriodicChecks();
  }

  // Respaldar métodos originales de console
  backupConsole() {
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
      trace: console.trace,
      table: console.table,
      group: console.group,
      groupEnd: console.groupEnd,
      time: console.time,
      timeEnd: console.timeEnd,
      clear: console.clear
    };
  }

  // Deshabilitar console
  disableConsole() {
    const noop = () => {};
    const fakeConsole = () => {
      throw new Error('Console access denied');
    };

    Object.keys(this.originalConsole).forEach(method => {
      console[method] = fakeConsole;
    });

    // Deshabilitar console global
    Object.defineProperty(window, 'console', {
      get: () => {
        throw new Error('Console access denied');
      },
      set: () => {}
    });
  }

  // Detectar DevTools
  detectDevTools() {
    let devtools = {
      open: false,
      orientation: null
    };

    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.handleDevToolsDetected();
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  // Manejar detección de DevTools
  handleDevToolsDetected() {
    this.isDevToolsOpen = true;
    
    // Limpiar página
    document.body.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        z-index: 999999;
      ">
        <div style="text-align: center;">
          <h1>🔒 Acceso Denegado</h1>
          <p>Las herramientas de desarrollador no están permitidas</p>
          <p>Por favor, cierre las herramientas de desarrollador para continuar</p>
        </div>
      </div>
    `;

    // Bloquear navegación
    window.location.href = 'about:blank';
  }

  // Deshabilitar clic derecho
  disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showWarning('Clic derecho deshabilitado');
      return false;
    });
  }

  // Deshabilitar atajos de teclado
  disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && (e.key === 'U' || e.key === 'S'))) {
        e.preventDefault();
        this.showWarning('Atajo de teclado deshabilitado');
        return false;
      }
    });
  }

  // Deshabilitar selección de texto
  disableTextSelection() {
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });

    // CSS para deshabilitar selección
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Ofuscar código
  obfuscateCode() {
    // Cambiar nombres de variables globales
    const originalWindow = window;
    const obfuscatedNames = {
      'React': '_0x1a2b',
      'ReactDOM': '_0x3c4d',
      'document': '_0x5e6f',
      'window': '_0x7g8h',
      'localStorage': '_0x9i0j',
      'sessionStorage': '_0x1k2l'
    };

    Object.keys(obfuscatedNames).forEach(original => {
      if (originalWindow[original]) {
        originalWindow[obfuscatedNames[original]] = originalWindow[original];
        delete originalWindow[original];
      }
    });
  }

  // Detectar inspección
  detectInspection() {
    // Detectar si se está inspeccionando el DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Verificar si se agregaron elementos de DevTools
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const className = node.className || '';
              const id = node.id || '';
              
              if (className.includes('devtools') || 
                  id.includes('devtools') ||
                  className.includes('chrome-devtools') ||
                  id.includes('chrome-devtools')) {
                this.handleDevToolsDetected();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Verificaciones periódicas
  startPeriodicChecks() {
    this.devToolsCheckInterval = setInterval(() => {
      this.checkDevTools();
      this.checkConsoleAccess();
      this.checkDebugger();
    }, 1000);
  }

  // Verificar DevTools
  checkDevTools() {
    const widthThreshold = 160;
    const heightThreshold = 160;

    if (window.outerWidth - window.innerWidth > widthThreshold ||
        window.outerHeight - window.innerHeight > heightThreshold) {
      this.handleDevToolsDetected();
    }
  }

  // Verificar acceso a console
  checkConsoleAccess() {
    try {
      const testConsole = console;
      if (testConsole && typeof testConsole.log === 'function') {
        // Si console está disponible, algo está mal
        this.handleDevToolsDetected();
      }
    } catch (e) {
      // Console está bloqueado, todo bien
    }
  }

  // Verificar debugger
  checkDebugger() {
    const start = Date.now();
    debugger;
    const end = Date.now();
    
    if (end - start > 100) {
      // Si el debugger se activó, hay DevTools abiertos
      this.handleDevToolsDetected();
    }
  }

  // Mostrar advertencia
  showWarning(message) {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 999999;
      font-family: Arial, sans-serif;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    warning.textContent = message;
    document.body.appendChild(warning);

    setTimeout(() => {
      if (warning.parentNode) {
        warning.parentNode.removeChild(warning);
      }
    }, 3000);
  }

  // Limpiar recursos
  destroy() {
    if (this.devToolsCheckInterval) {
      clearInterval(this.devToolsCheckInterval);
    }
    
    // Restaurar console
    Object.keys(this.originalConsole).forEach(method => {
      console[method] = this.originalConsole[method];
    });
  }
}

// Inicializar protección
let antiInspection = null;

export const initAntiInspection = () => {
  if (!antiInspection) {
    antiInspection = new AntiInspection();
  }
  return antiInspection;
};

export const destroyAntiInspection = () => {
  if (antiInspection) {
    antiInspection.destroy();
    antiInspection = null;
  }
};

export default AntiInspection;
