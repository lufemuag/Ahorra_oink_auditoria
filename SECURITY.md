# 🔒 Guía de Seguridad - Ahorra Oink

## Medidas de Seguridad Implementadas

### 🛡️ Frontend (React + Vite)

#### **1. Ofuscación y Minificación**
- **Terser**: Ofuscación avanzada de código JavaScript
- **Minificación**: Eliminación de espacios, comentarios y código muerto
- **Mangling**: Ofuscación de nombres de variables y funciones
- **Chunking**: División del código en archivos más pequeños y ofuscados

#### **2. Protección contra Inspección**
- **Detección de DevTools**: Alerta cuando se abren herramientas de desarrollo
- **Anti-Debug**: Detección y prevención de debugging
- **Validación de Integridad**: Verificación de que las funciones críticas no han sido modificadas
- **Limpieza de Datos**: Eliminación automática de información sensible del DOM

#### **3. Encriptación de Datos Locales**
- **Ofuscación de Strings**: Encriptación de strings sensibles
- **Tokens Seguros**: Generación de tokens seguros para autenticación
- **Limpieza de Storage**: Eliminación automática de datos sensibles del localStorage

### 🔐 Backend (Django)

#### **1. Headers de Seguridad**
- **X-Content-Type-Options**: Prevención de MIME type sniffing
- **X-Frame-Options**: Protección contra clickjacking
- **X-XSS-Protection**: Protección contra XSS
- **Content-Security-Policy**: Política estricta de contenido
- **HSTS**: HTTP Strict Transport Security

#### **2. Middleware de Seguridad**
- **SecurityHeadersMiddleware**: Headers de seguridad adicionales
- **AntiTamperingMiddleware**: Detección de manipulación
- **RateLimitMiddleware**: Limitación de velocidad de peticiones
- **SecurityLoggingMiddleware**: Registro de eventos de seguridad

#### **3. Configuración de Cookies**
- **Secure**: Cookies solo por HTTPS
- **HttpOnly**: Prevención de acceso desde JavaScript
- **SameSite**: Protección contra CSRF

## 🚀 Instrucciones de Despliegue Seguro

### **1. Build de Producción**
```bash
# Usar el script de build seguro
./build_secure.sh  # Linux/Mac
build_secure.bat   # Windows
```

### **2. Configuración del Servidor Web**

#### **Nginx**
```nginx
server {
    listen 443 ssl http2;
    server_name tu-dominio.com;
    
    # Headers de seguridad
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none';" always;
    
    # Configuración SSL
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Archivos estáticos
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### **Apache**
```apache
<VirtualHost *:443>
    ServerName tu-dominio.com
    DocumentRoot /path/to/frontend/dist
    
    # Headers de seguridad
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none';"
    
    # Configuración SSL
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # Proxy para API
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:8000/api/
    ProxyPassReverse /api/ http://localhost:8000/api/
</VirtualHost>
```

### **3. Configuración de Django para Producción**

#### **settings.py**
```python
# Configuración de producción
DEBUG = False
ALLOWED_HOSTS = ['tu-dominio.com', 'www.tu-dominio.com']

# Configuración de seguridad
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Cookies seguras
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'
```

## 🔍 Monitoreo de Seguridad

### **1. Logs de Seguridad**
- Revisar logs de Django regularmente
- Monitorear intentos de acceso no autorizado
- Verificar headers de seguridad en las respuestas

### **2. Herramientas de Monitoreo**
- **OWASP ZAP**: Escaneo de vulnerabilidades
- **SSL Labs**: Verificación de configuración SSL
- **Security Headers**: Verificación de headers de seguridad

### **3. Mantenimiento**
- Actualizar dependencias regularmente
- Revisar logs de seguridad semanalmente
- Realizar backups seguros de la base de datos

## ⚠️ Advertencias Importantes

### **1. Limitaciones de la Ofuscación**
- La ofuscación del frontend **NO** es seguridad real
- El código JavaScript siempre es visible en el navegador
- La ofuscación solo dificulta la ingeniería inversa

### **2. Seguridad Real**
- La seguridad real está en el **backend**
- Validar y sanitizar **todos** los inputs
- Usar autenticación y autorización robustas
- Implementar rate limiting y monitoreo

### **3. Mejores Prácticas**
- Nunca confiar en la seguridad del frontend
- Implementar validación en ambos extremos
- Usar HTTPS en producción
- Mantener secretos en variables de entorno

## 📞 Contacto de Seguridad

Si encuentras una vulnerabilidad de seguridad, por favor:
1. **NO** la publiques públicamente
2. Contacta al equipo de desarrollo
3. Proporciona detalles específicos
4. Permite tiempo para la corrección

---

**Recuerda**: La seguridad es un proceso continuo, no un estado final. Mantén siempre actualizadas las medidas de seguridad y monitorea regularmente la aplicación.
