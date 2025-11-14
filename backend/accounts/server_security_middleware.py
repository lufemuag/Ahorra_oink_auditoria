# accounts/server_security_middleware.py
# Middleware para ocultar información del servidor

class ServerSecurityMiddleware:
    """
    Middleware para ocultar información del servidor y mejorar la seguridad
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Ocultar información del servidor
        if 'Server' in response:
            del response['Server']
        
        # Agregar header personalizado genérico
        response['Server'] = 'WebServer'
        
        # Mejorar headers de seguridad
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        return response



