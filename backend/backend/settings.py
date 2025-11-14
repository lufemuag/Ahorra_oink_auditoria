from pathlib import Path
import os
from datetime import timedelta


BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
ROOT_DIR = BASE_DIR.parent  # carpeta raíz del proyecto (LUFEMUAG-AHORRA-OINK)


SECRET_KEY = 'django-insecure-reemplaza-esto-por-una-clave-segura'
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']  # Solo hosts específicos permitidos


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'csp',

    'accounts',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  
    'csp.middleware.CSPMiddleware',
    'accounts.server_security_middleware.ServerSecurityMiddleware',
    'accounts.security_middleware.SecurityHeadersMiddleware',
    'accounts.security_middleware.AntiTamperingMiddleware',
    'accounts.security_middleware.RateLimitMiddleware',
    'accounts.security_middleware.SecurityLoggingMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'backend.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            ROOT_DIR / 'frontend' / 'dist',   # apunta al build del frontend
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'backend.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True


# === Archivos estáticos ===
STATIC_URL = 'static/'
STATICFILES_DIRS = [
    ROOT_DIR / 'frontend' / 'dist' / 'assets',  # portable, funciona en cualquier PC
]
STATIC_ROOT = BASE_DIR / 'staticfiles'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# === CORS/CSRF ===
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_ALL_ORIGINS = False  # Deshabilitado por seguridad
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]


# === DRF + SimpleJWT ===
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "accounts.auth.UsuarioJWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# === CONFIGURACIÓN DE SEGURIDAD ===
# Headers de seguridad para proteger contra ataques comunes
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000  # 1 año
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Configuración de cookies seguras
SESSION_COOKIE_SECURE = False  # False para desarrollo HTTP
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'  # Lax para desarrollo
CSRF_COOKIE_SECURE = False  # False para desarrollo HTTP
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'

# Configuración de headers de seguridad personalizados
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
SECURE_CROSS_ORIGIN_OPENER_POLICY = 'same-origin'

# Content Security Policy (CSP) - Configuración segura (nuevo formato)
CONTENT_SECURITY_POLICY = {
    'DIRECTIVES': {
        'base-uri': ("'self'",),
        'block-all-mixed-content': True,
        'connect-src': ("'self'", 'http://localhost:8000', 'http://127.0.0.1:8000'),
        'default-src': ("'self'",),
        'font-src': ("'self'", 'data:'),
        'form-action': ("'self'",),
        'frame-ancestors': ("'none'",),  # Protección contra Clickjacking
        'frame-src': ("'none'",),
        'img-src': ("'self'", 'data:', 'blob:'),
        'manifest-src': ("'self'",),
        'media-src': ("'self'",),
        'object-src': ("'none'",),
        'script-src': ("'self'", "'nonce-{nonce}'"),  # Removido unsafe-inline y unsafe-eval
        'style-src': ("'self'", "'nonce-{nonce}'"),   # Removido unsafe-inline
        'upgrade-insecure-requests': True,
        'worker-src': ("'self'",)
    }
}

# Ocultar información del servidor
DISALLOWED_USER_AGENTS = []
SECURE_SERVER_HEADERS = True