#!/usr/bin/env python
"""
Script seguro para iniciar el servidor backend de Django
"""
import os
import sys
import subprocess
from dotenv import load_dotenv

def load_environment():
    """Cargar variables de entorno"""
    load_dotenv('database_config.env')
    print("Variables de entorno cargadas")

def start_django_server_safe():
    """Iniciar servidor Django de forma segura"""
    print("Iniciando servidor backend Django...")
    
    # Cambiar al directorio del backend
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_dir)
    
    try:
        # Primero verificar la configuración
        print("Verificando configuración de Django...")
        result = subprocess.run([
            sys.executable, 'manage.py', 'check', '--deploy'
        ], capture_output=True, text=True)
        
        if result.returncode != 0:
            print("Advertencia: Django encontró algunos problemas de configuración")
            print("Continuando de todas formas...")
        
        # Ejecutar servidor Django en puerto 8000
        print("\n" + "="*50)
        print("🚀 SERVIDOR DJANGO INICIADO")
        print("="*50)
        print("📍 URL: http://localhost:8000")
        print("🔗 API: http://localhost:8000/api/")
        print("⚙️  Admin: http://localhost:8000/admin/")
        print("📊 Base de datos: MySQL en puerto 3306")
        print("\n💡 Presiona Ctrl+C para detener el servidor")
        print("="*50)
        
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '127.0.0.1:8000'
        ])
        
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor Django detenido por el usuario")
    except Exception as e:
        print(f"\n❌ Error iniciando Django: {e}")
        print("\n🔧 Soluciones posibles:")
        print("   1. Verificar que XAMPP esté ejecutándose")
        print("   2. Verificar que MySQL esté en puerto 3306")
        print("   3. Ejecutar: python create_tables.py")

def main():
    """Función principal"""
    print("🐷 AHORRA OINK - BACKEND DJANGO")
    print("=" * 40)
    
    # Cargar configuración
    load_environment()
    
    # Iniciar servidor
    start_django_server_safe()

if __name__ == '__main__':
    main()
