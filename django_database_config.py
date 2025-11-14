# ===========================================
# CONFIGURACIÓN DE BASE DE DATOS PARA DJANGO
# ===========================================

import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv('database_config.env')

# Configuración de base de datos para Django
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'ahorra_oink'),
        'USER': os.getenv('DB_USER', 'root'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
    }
}

# Configuración adicional
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-reemplaza-esto-por-una-clave-segura')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

# Para usar en settings.py de Django:
# from django_database_config import DATABASES, SECRET_KEY, DEBUG
