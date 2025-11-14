#!/usr/bin/env python
"""
Script para iniciar el servidor frontend de React/Vite
"""
import os
import sys
import subprocess
import time

def start_frontend_server():
    """Iniciar servidor frontend"""
    print("Iniciando servidor frontend React/Vite...")
    
    # Cambiar al directorio del frontend
    frontend_dir = os.path.join(os.path.dirname(__file__), 'frontend')
    os.chdir(frontend_dir)
    
    try:
        # Verificar si node_modules existe
        if not os.path.exists('node_modules'):
            print("Instalando dependencias del frontend...")
            subprocess.run(['npm', 'install'], check=True)
        
        # Ejecutar servidor de desarrollo
        print("Servidor frontend ejecutándose en: http://localhost:5173")
        print("Presiona Ctrl+C para detener el servidor")
        
        subprocess.run(['npm', 'run', 'dev'])
        
    except KeyboardInterrupt:
        print("\nServidor frontend detenido")
    except subprocess.CalledProcessError as e:
        print(f"Error en npm: {e}")
    except Exception as e:
        print(f"Error iniciando frontend: {e}")

def main():
    """Función principal"""
    print("FRONTEND REACT/VITE - AHORRA OINK")
    print("=" * 40)
    
    # Iniciar servidor
    start_frontend_server()

if __name__ == '__main__':
    main()
