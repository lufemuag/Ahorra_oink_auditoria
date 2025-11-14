#!/usr/bin/env python
"""
Script para iniciar tanto el frontend como el backend simultáneamente
"""
import os
import sys
import subprocess
import threading
import time
from dotenv import load_dotenv

def load_environment():
    """Cargar variables de entorno"""
    load_dotenv('database_config.env')
    print("Variables de entorno cargadas")

def start_backend():
    """Iniciar backend en un hilo separado"""
    print("Iniciando backend Django...")
    
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_dir)
    
    try:
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '127.0.0.1:8000'
        ])
    except Exception as e:
        print(f"Error en backend: {e}")

def start_frontend():
    """Iniciar frontend en un hilo separado"""
    print("Iniciando frontend React/Vite...")
    
    frontend_dir = os.path.join(os.path.dirname(__file__), 'frontend')
    os.chdir(frontend_dir)
    
    try:
        # Verificar dependencias
        if not os.path.exists('node_modules'):
            print("Instalando dependencias del frontend...")
            subprocess.run(['npm', 'install'], check=True)
        
        subprocess.run(['npm', 'run', 'dev'])
    except Exception as e:
        print(f"Error en frontend: {e}")

def main():
    """Función principal"""
    print("INICIANDO AHORRA OINK - FULL STACK")
    print("=" * 50)
    
    # Cargar configuración
    load_environment()
    
    print("Servicios que se iniciarán:")
    print("  - Backend Django: http://localhost:8000")
    print("  - Frontend React: http://localhost:5173")
    print("  - phpMyAdmin: http://localhost/phpmyadmin")
    print("  - Base de datos: MySQL en puerto 3306")
    print("\nPresiona Ctrl+C para detener todos los servicios")
    
    try:
        # Crear hilos para cada servicio
        backend_thread = threading.Thread(target=start_backend, daemon=True)
        frontend_thread = threading.Thread(target=start_frontend, daemon=True)
        
        # Iniciar hilos
        backend_thread.start()
        time.sleep(2)  # Esperar un poco para que Django inicie
        frontend_thread.start()
        
        # Mantener el script ejecutándose
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nDeteniendo todos los servicios...")
        print("Servicios detenidos")

if __name__ == '__main__':
    main()
