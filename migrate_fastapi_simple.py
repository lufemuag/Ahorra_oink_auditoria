#!/usr/bin/env python
"""
Script para crear y ejecutar migraciones en FastAPI con Alembic
"""
import os
import sys
from sqlalchemy import create_engine, text
from alembic.config import Config
from alembic import command
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv('database_config.env')

def create_database_if_not_exists():
    """Crear base de datos si no existe"""
    print("Verificando existencia de la base de datos...")
    
    # Conectar sin especificar base de datos
    db_url = os.getenv('FASTAPI_DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/ahorra_oink')
    db_name = os.getenv('DB_NAME', 'ahorra_oink')
    
    # URL sin base de datos específica
    base_url = db_url.rsplit('/', 1)[0] + '/'
    
    try:
        engine = create_engine(base_url)
        with engine.connect() as conn:
            # Crear base de datos si no existe
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name}"))
            conn.commit()
        print(f"Base de datos '{db_name}' verificada/creada")
    except Exception as e:
        print(f"Error al crear base de datos: {e}")
        sys.exit(1)

def init_alembic():
    """Inicializar Alembic"""
    print("Inicializando Alembic...")
    
    if not os.path.exists('alembic'):
        command.init(Config(), 'alembic')
        print("Alembic inicializado")
    else:
        print("Alembic ya está inicializado")

def create_migration(message="Initial migration"):
    """Crear migración"""
    print(f"Creando migración: {message}")
    
    alembic_cfg = Config('alembic.ini')
    command.revision(alembic_cfg, message=message, autogenerate=True)
    print("Migración creada")

def apply_migrations():
    """Aplicar migraciones"""
    print("Aplicando migraciones de FastAPI...")
    
    alembic_cfg = Config('alembic.ini')
    command.upgrade(alembic_cfg, 'head')
    print("Migraciones aplicadas")

def main():
    """Función principal"""
    print("Iniciando migraciones de FastAPI...")
    
    try:
        create_database_if_not_exists()
        init_alembic()
        create_migration("Initial migration")
        apply_migrations()
        print("Migraciones de FastAPI completadas exitosamente!")
        
    except Exception as e:
        print(f"Error en migraciones de FastAPI: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
