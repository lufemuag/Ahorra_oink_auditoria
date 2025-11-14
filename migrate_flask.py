#!/usr/bin/env python
"""
Script para crear y ejecutar migraciones en Flask
"""
import os
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv('database_config.env')

def create_flask_app():
    """Crear aplicación Flask para migraciones"""
    app = Flask(__name__)
    
    # Configuración de base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('FLASK_DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/ahorra_oink')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'flask-secret-key')
    
    return app

def setup_migrations():
    """Configurar migraciones de Flask"""
    app = create_flask_app()
    db = SQLAlchemy(app)
    migrate = Migrate(app, db)
    
    return app, db, migrate

def init_migrations():
    """Inicializar migraciones"""
    print("🔄 Inicializando migraciones de Flask...")
    os.system('flask db init')
    print("✅ Migraciones inicializadas")

def create_migration(message="Initial migration"):
    """Crear migración"""
    print(f"🔄 Creando migración: {message}")
    os.system(f'flask db migrate -m "{message}"')
    print("✅ Migración creada")

def apply_migrations():
    """Aplicar migraciones"""
    print("🔄 Aplicando migraciones de Flask...")
    os.system('flask db upgrade')
    print("✅ Migraciones aplicadas")

def main():
    """Función principal"""
    print("🚀 Iniciando migraciones de Flask...")
    
    try:
        # Configurar variables de entorno para Flask
        os.environ['FLASK_APP'] = 'migrate_flask.py'
        
        # Verificar si ya existe la carpeta migrations
        if not os.path.exists('migrations'):
            init_migrations()
        
        create_migration("Initial migration")
        apply_migrations()
        print("🎉 Migraciones de Flask completadas exitosamente!")
        
    except Exception as e:
        print(f"❌ Error en migraciones de Flask: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
