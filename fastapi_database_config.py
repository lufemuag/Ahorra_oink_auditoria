# ===========================================
# CONFIGURACIÓN DE BASE DE DATOS PARA FASTAPI
# ===========================================

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Cargar variables de entorno
load_dotenv('database_config.env')

# URL de la base de datos
DATABASE_URL = os.getenv('FASTAPI_DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/ahorra_oink')

# Crear motor de base de datos
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=True  # Cambiar a False en producción
)

# Crear sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

# Función para obtener sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Configuración adicional
SECRET_KEY = os.getenv('SECRET_KEY', 'fastapi-secret-key-change-this')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Para usar en main.py de FastAPI:
# from fastapi_database_config import engine, SessionLocal, Base, get_db
