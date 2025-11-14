#!/usr/bin/env python
"""
Script seguro para iniciar el servidor frontend de React/Vite
"""
import os
import sys
import subprocess
import time

def start_frontend_server_safe():
    """Iniciar servidor frontend de forma segura"""
    print("Iniciando servidor frontend React/Vite...")
    
    # Cambiar al directorio del frontend
    frontend_dir = os.path.join(os.path.dirname(__file__), 'frontend')
    os.chdir(frontend_dir)
    
    try:
        # Verificar si node_modules existe
        if not os.path.exists('node_modules'):
            print("📦 Instalando dependencias del frontend...")
            print("Esto puede tomar unos minutos...")
            result = subprocess.run(['npm', 'install'], check=True)
            if result.returncode == 0:
                print("✅ Dependencias instaladas correctamente")
            else:
                print("❌ Error instalando dependencias")
                return
        else:
            print("✅ Dependencias ya instaladas")
        
        # Ejecutar servidor de desarrollo
        print("\n" + "="*50)
        print("🚀 SERVIDOR FRONTEND INICIADO")
        print("="*50)
        print("📍 URL: http://localhost:5173")
        print("🔗 Proxy API: /api -> http://localhost:8000")
        print("💡 Presiona Ctrl+C para detener el servidor")
        print("="*50)
        
        subprocess.run(['npm', 'run', 'dev'])
        
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor frontend detenido por el usuario")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error en npm: {e}")
        print("\n🔧 Soluciones posibles:")
        print("   1. Verificar que Node.js esté instalado")
        print("   2. Ejecutar: npm install")
        print("   3. Verificar que el puerto 5173 esté libre")
    except Exception as e:
        print(f"\n❌ Error iniciando frontend: {e}")

def main():
    """Función principal"""
    print("🐷 AHORRA OINK - FRONTEND REACT")
    print("=" * 40)
    
    # Iniciar servidor
    start_frontend_server_safe()

if __name__ == '__main__':
    main()
