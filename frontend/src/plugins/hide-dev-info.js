// src/plugins/hide-dev-info.js
// Plugin para ocultar información de desarrollo

export function hideDevInfoPlugin() {
  return {
    name: 'hide-dev-info',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Interceptar respuestas HTML para limpiar información de desarrollo
        const originalWrite = res.write;
        const originalEnd = res.end;
        let chunks = [];

        res.write = function(chunk) {
          chunks.push(chunk);
          return true;
        };

        res.end = function(chunk) {
          if (chunk) {
            chunks.push(chunk);
          }

          // Procesar el contenido HTML
          let html = Buffer.concat(chunks).toString('utf8');
          
          // Remover scripts de desarrollo de React
          html = html.replace(
            /<script type="module">import { injectIntoGlobalHook } from "\/@react-refresh";[\s\S]*?<\/script>/g,
            ''
          );
          
          // Remover scripts de Vite client
          html = html.replace(
            /<script type="module" src="\/@vite\/client"><\/script>/g,
            ''
          );
          
          // Remover comentarios de desarrollo
          html = html.replace(/<!--[\s\S]*?-->/g, '');
          
          // Limpiar espacios en blanco excesivos
          html = html.replace(/\n\s*\n/g, '\n');

          // Enviar el HTML limpio
          res.setHeader('Content-Length', Buffer.byteLength(html));
          originalWrite.call(res, html);
          originalEnd.call(res);
        };

        next();
      });
    }
  };
}



