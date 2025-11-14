#!/usr/bin/env python
"""
Script para iniciar el servidor backend de Django
"""
import os
import sys
import subprocess
from dotenv import load_dotenv

def load_environment():
    """Cargar variables de entorno"""
    load_dotenv('database_config.env')
    print("Variables de entorno cargadas")

def start_django_server():
    """Iniciar servidor Django"""
    print("Iniciando servidor backend Django...")
    
    # Cambiar al directorio del backend
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_dir)
    
    try:
        # Ejecutar servidor Django en puerto 8000
        print("Servidor Django ejecutándose en: http://localhost:8000")
        print("API disponible en: http://localhost:8000/api/")
        print("Admin disponible en: http://localhost:8000/admin/")
        print("\nPresiona Ctrl+C para detener el servidor")
        
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '127.0.0.1:8000'
        ])
        
    except KeyboardInterrupt:
        print("\nServidor Django detenido")
    except Exception as e:
        print(f"Error iniciando Django: {e}")

def main():
    """Función principal"""
    print("BACKEND DJANGO - AHORRA OINK")
    print("=" * 40)
    
    # Cargar configuración
    load_environment()
    
    # Iniciar servidor
    start_django_server()

if __name__ == '__main__':
    main()
