# ===========================================
# CONFIGURACIÓN DE BASE DE DATOS PARA FLASK
# ===========================================

import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv('database_config.env')

# Configuración de base de datos para Flask
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'flask-secret-key-change-this')
    SQLALCHEMY_DATABASE_URI = os.getenv('FLASK_DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/ahorra_oink')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }

# Configuración de desarrollo
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

# Configuración de producción
class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False

# Configuración por defecto
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

# Para usar en app.py de Flask:
# from flask_database_config import config
# app.config.from_object(config['development'])
