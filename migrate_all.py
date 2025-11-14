#!/usr/bin/env python
"""
Script maestro para ejecutar migraciones en todos los frameworks
"""
import os
import sys
import subprocess
from dotenv import load_dotenv

def load_environment():
    """Cargar variables de entorno"""
    load_dotenv('database_config.env')
    print("✅ Variables de entorno cargadas")

def test_database_connection():
    """Probar conexión a la base de datos"""
    print("🔄 Probando conexión a la base de datos...")
    
    try:
        import pymysql
        
        # Parámetros de conexión
        host = os.getenv('DB_HOST', 'localhost')
        port = int(os.getenv('DB_PORT', '3306'))
        user = os.getenv('DB_USER', 'root')
        password = os.getenv('DB_PASSWORD', '')
        database = os.getenv('DB_NAME', 'ahorra_oink')
        
        # Conectar a MySQL
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"✅ Conectado a MySQL {version[0]}")
            
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        print("💡 Asegúrate de que:")
        print("   - MySQL/MariaDB esté ejecutándose")
        print("   - La base de datos 'ahorra_oink' exista")
        print("   - Las credenciales sean correctas")
        return False

def run_django_migrations():
    """Ejecutar migraciones de Django"""
    print("\n🔄 Ejecutando migraciones de Django...")
    try:
        result = subprocess.run([sys.executable, 'migrate_django.py'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Migraciones de Django completadas")
        else:
            print(f"❌ Error en Django: {result.stderr}")
    except Exception as e:
        print(f"❌ Error ejecutando Django: {e}")

def run_flask_migrations():
    """Ejecutar migraciones de Flask"""
    print("\n🔄 Ejecutando migraciones de Flask...")
    try:
        result = subprocess.run([sys.executable, 'migrate_flask.py'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Migraciones de Flask completadas")
        else:
            print(f"❌ Error en Flask: {result.stderr}")
    except Exception as e:
        print(f"❌ Error ejecutando Flask: {e}")

def run_fastapi_migrations():
    """Ejecutar migraciones de FastAPI"""
    print("\n🔄 Ejecutando migraciones de FastAPI...")
    try:
        result = subprocess.run([sys.executable, 'migrate_fastapi.py'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Migraciones de FastAPI completadas")
        else:
            print(f"❌ Error en FastAPI: {result.stderr}")
    except Exception as e:
        print(f"❌ Error ejecutando FastAPI: {e}")

def main():
    """Función principal"""
    print("🚀 INICIANDO MIGRACIONES COMPLETAS")
    print("=" * 50)
    
    # Cargar configuración
    load_environment()
    
    # Probar conexión
    if not test_database_connection():
        print("\n❌ No se puede continuar sin conexión a la base de datos")
        sys.exit(1)
    
    # Ejecutar migraciones
    run_django_migrations()
    run_flask_migrations()
    run_fastapi_migrations()
    
    print("\n" + "=" * 50)
    print("🎉 TODAS LAS MIGRACIONES COMPLETADAS")
    print("💡 Puedes verificar las tablas en phpMyAdmin:")
    print("   http://localhost/phpmyadmin/index.php?route=/database/structure&db=ahorra_oink")

if __name__ == '__main__':
    main()
