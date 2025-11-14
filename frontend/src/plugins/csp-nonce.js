// src/plugins/csp-nonce.js
// Plugin de Vite para generar nonces CSP dinámicamente

import { createHash } from 'crypto';

export function cspNoncePlugin() {
  return {
    name: 'csp-nonce',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Generar nonce único para cada request
        const nonce = createHash('sha256')
          .update(Date.now().toString() + Math.random().toString())
          .digest('base64')
          .substring(0, 16);
        
        // Agregar nonce a los headers de respuesta
        res.setHeader('Content-Security-Policy', 
          `default-src 'self'; ` +
          `script-src 'self' 'nonce-${nonce}'; ` +
          `style-src 'self' 'nonce-${nonce}'; ` +
          `img-src 'self' data: blob:; ` +
          `font-src 'self' data:; ` +
          `connect-src 'self' http://localhost:8000 http://127.0.0.1:8000; ` +
          `frame-ancestors 'none'; ` +
          `base-uri 'self'; ` +
          `form-action 'self'; ` +
          `object-src 'none'; ` +
          `media-src 'self'; ` +
          `worker-src 'self'; ` +
          `manifest-src 'self'; ` +
          `upgrade-insecure-requests; ` +
          `block-all-mixed-content; ` +
          `frame-src 'none'`
        );
        
        // Agregar todos los headers de seguridad
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        res.setHeader('Server', 'WebServer');
        
        // Headers adicionales para ocultar información de desarrollo
        res.setHeader('X-Powered-By', '');
        res.setHeader('X-AspNet-Version', '');
        res.setHeader('X-AspNetMvc-Version', '');
        
        next();
      });
    }
  };
}
