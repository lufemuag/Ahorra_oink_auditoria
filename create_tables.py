#!/usr/bin/env python
"""
Script para crear tablas básicas en la base de datos MySQL
"""
import os
import sys
import pymysql
from dotenv import load_dotenv

def load_environment():
    """Cargar variables de entorno"""
    load_dotenv('database_config.env')
    print("Variables de entorno cargadas")

def get_connection():
    """Obtener conexión a la base de datos"""
    host = os.getenv('DB_HOST', 'localhost')
    port = int(os.getenv('DB_PORT', '3306'))
    user = os.getenv('DB_USER', 'root')
    password = os.getenv('DB_PASSWORD', '')
    database = os.getenv('DB_NAME', 'ahorra_oink')
    
    return pymysql.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database,
        charset='utf8mb4'
    )

def create_basic_tables():
    """Crear tablas básicas para el proyecto"""
    print("Creando tablas básicas...")
    
    connection = get_connection()
    
    try:
        with connection.cursor() as cursor:
            # Tabla de usuarios
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    first_name VARCHAR(50),
                    last_name VARCHAR(50),
                    is_active BOOLEAN DEFAULT TRUE,
                    is_admin BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            
            # Tabla de categorías
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS categories (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    description TEXT,
                    color VARCHAR(7) DEFAULT '#007bff',
                    icon VARCHAR(50),
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            
            # Tabla de transacciones
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS transactions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    category_id INT,
                    type ENUM('income', 'expense') NOT NULL,
                    amount DECIMAL(10,2) NOT NULL,
                    description TEXT,
                    date DATE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            
            # Tabla de metas de ahorro
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS savings_goals (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    target_amount DECIMAL(10,2) NOT NULL,
                    current_amount DECIMAL(10,2) DEFAULT 0.00,
                    target_date DATE,
                    description TEXT,
                    is_completed BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            
            # Tabla de logros
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS achievements (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    description TEXT,
                    icon VARCHAR(50),
                    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            
            # Tabla de notificaciones
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    title VARCHAR(200) NOT NULL,
                    message TEXT NOT NULL,
                    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
                    is_read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            
            # Insertar categorías por defecto
            cursor.execute("""
                INSERT IGNORE INTO categories (name, description, color, icon) VALUES
                ('Alimentación', 'Gastos en comida y bebida', '#28a745', 'food'),
                ('Transporte', 'Gastos de transporte público y privado', '#007bff', 'car'),
                ('Entretenimiento', 'Gastos de ocio y entretenimiento', '#ffc107', 'game'),
                ('Salud', 'Gastos médicos y farmacéuticos', '#dc3545', 'health'),
                ('Educación', 'Gastos educativos y cursos', '#6f42c1', 'book'),
                ('Vivienda', 'Gastos de alquiler, servicios, etc.', '#fd7e14', 'home'),
                ('Salario', 'Ingresos por trabajo', '#20c997', 'money'),
                ('Freelance', 'Ingresos por trabajos independientes', '#17a2b8', 'briefcase'),
                ('Inversiones', 'Ingresos por inversiones', '#6c757d', 'chart')
            """)
            
            connection.commit()
            print("Tablas creadas exitosamente!")
            
    except Exception as e:
        print(f"Error creando tablas: {e}")
        connection.rollback()
    finally:
        connection.close()

def show_tables():
    """Mostrar las tablas creadas"""
    print("\nVerificando tablas creadas...")
    
    connection = get_connection()
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            print(f"Se encontraron {len(tables)} tablas:")
            for table in tables:
                print(f"  - {table[0]}")
                
    except Exception as e:
        print(f"Error verificando tablas: {e}")
    finally:
        connection.close()

def main():
    """Función principal"""
    print("CREANDO TABLAS EN LA BASE DE DATOS")
    print("=" * 50)
    
    # Cargar configuración
    load_environment()
    
    # Crear tablas
    create_basic_tables()
    
    # Mostrar tablas
    show_tables()
    
    print("\n" + "=" * 50)
    print("TABLAS CREADAS EXITOSAMENTE")
    print("Puedes verificar las tablas en phpMyAdmin:")
    print("http://localhost/phpmyadmin/index.php?route=/database/structure&db=ahorra_oink")

if __name__ == '__main__':
    main()
