# accounts/security_middleware.py
# Middleware personalizado para añadir headers de seguridad adicionales

from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse
import logging

logger = logging.getLogger('security')

class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware para añadir headers de seguridad adicionales
    """
    
    def process_response(self, request, response):
        # Headers de seguridad básicos
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        # Content Security Policy seguro - SIN unsafe-inline ni unsafe-eval
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'nonce-{nonce}'; "
            "style-src 'self' 'nonce-{nonce}'; "
            "img-src 'self' data: blob:; "
            "font-src 'self' data:; "
            "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self'; "
            "object-src 'none'; "
            "media-src 'self'; "
            "worker-src 'self'; "
            "manifest-src 'self'; "
            "upgrade-insecure-requests; "
            "block-all-mixed-content; "
            "frame-src 'none'"
        )
        response['Content-Security-Policy'] = csp
        
        # Headers adicionales de seguridad
        response['Cross-Origin-Embedder-Policy'] = 'require-corp'
        response['Cross-Origin-Opener-Policy'] = 'same-origin'
        response['Cross-Origin-Resource-Policy'] = 'same-origin'
        
        # Prevenir clickjacking
        response['X-Frame-Options'] = 'DENY'
        
        # Cache control para archivos sensibles
        if request.path.startswith('/api/') or request.path.startswith('/admin/'):
            response['Cache-Control'] = 'no-store, no-cache, must-revalidate, private'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
        
        return response

class AntiTamperingMiddleware(MiddlewareMixin):
    """
    Middleware para detectar y prevenir intentos de manipulación
    """
    
    def process_request(self, request):
        # Verificar headers sospechosos
        suspicious_headers = [
            'X-Forwarded-For',
            'X-Real-IP',
            'X-Originating-IP',
            'X-Remote-IP',
            'X-Remote-Addr'
        ]
        
        for header in suspicious_headers:
            if header in request.META:
                logger.warning(f"Suspicious header detected: {header} = {request.META[header]}")
        
        # Verificar User-Agent sospechoso
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        if any(keyword in user_agent.lower() for keyword in ['bot', 'crawler', 'spider', 'scraper']):
            logger.warning(f"Suspicious User-Agent detected: {user_agent}")
        
        return None

class RateLimitMiddleware(MiddlewareMixin):
    """
    Middleware básico para limitar la velocidad de las peticiones
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.requests = {}
        super().__init__(get_response)
    
    def process_request(self, request):
        # Obtener IP del cliente
        ip = self.get_client_ip(request)
        
        # Limitar peticiones por IP
        if ip in self.requests:
            import time
            current_time = time.time()
            # Limpiar peticiones antiguas (más de 1 minuto)
            self.requests[ip] = [req_time for req_time in self.requests[ip] if current_time - req_time < 60]
            
            # Verificar límite (máximo 100 peticiones por minuto)
            if len(self.requests[ip]) >= 100:
                logger.warning(f"Rate limit exceeded for IP: {ip}")
                return HttpResponse("Rate limit exceeded", status=429)
            
            self.requests[ip].append(current_time)
        else:
            import time
            self.requests[ip] = [time.time()]
        
        return None
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class SecurityLoggingMiddleware(MiddlewareMixin):
    """
    Middleware para registrar eventos de seguridad
    """
    
    def process_request(self, request):
        # Registrar peticiones a endpoints sensibles
        sensitive_paths = ['/admin/', '/api/auth/', '/api/admin/']
        
        if any(request.path.startswith(path) for path in sensitive_paths):
            logger.info(f"Access to sensitive endpoint: {request.path} from {self.get_client_ip(request)}")
        
        return None
    
    def process_response(self, request, response):
        # Registrar respuestas de error
        if response.status_code >= 400:
            logger.warning(f"Error response {response.status_code} for {request.path} from {self.get_client_ip(request)}")
        
        return response
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
