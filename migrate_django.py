#!/usr/bin/env python
"""
Script para crear y ejecutar migraciones en Django
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_django():
    """Configurar Django"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

def create_migrations():
    """Crear migraciones"""
    print("🔄 Creando migraciones de Django...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    print("✅ Migraciones creadas")

def apply_migrations():
    """Aplicar migraciones"""
    print("🔄 Aplicando migraciones de Django...")
    execute_from_command_line(['manage.py', 'migrate'])
    print("✅ Migraciones aplicadas")

def main():
    """Función principal"""
    print("🚀 Iniciando migraciones de Django...")
    
    # Cambiar al directorio del backend
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_dir)
    
    setup_django()
    
    try:
        create_migrations()
        apply_migrations()
        print("🎉 Migraciones de Django completadas exitosamente!")
    except Exception as e:
        print(f"❌ Error en migraciones de Django: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
