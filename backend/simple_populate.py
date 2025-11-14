#!/usr/bin/env python3
"""
Script simple para poblar la base de datos con datos iniciales
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import Category, Achievement, Usuario
from django.contrib.auth.hashers import make_password

def create_categories():
    """Crear categorías iniciales"""
    print("Creando categorias...")
    
    categories = [
        # Categorías de ingresos
        {'name': 'Salario', 'description': 'Ingresos por trabajo', 'color': '#28a745', 'icon': 'briefcase'},
        {'name': 'Freelance', 'description': 'Trabajos independientes', 'color': '#17a2b8', 'icon': 'laptop'},
        {'name': 'Inversiones', 'description': 'Ganancias de inversiones', 'color': '#ffc107', 'icon': 'trending-up'},
        {'name': 'Regalos', 'description': 'Dinero recibido como regalo', 'color': '#e83e8c', 'icon': 'gift'},
        {'name': 'Otros Ingresos', 'description': 'Otros tipos de ingresos', 'color': '#6f42c1', 'icon': 'plus-circle'},
        
        # Categorías de gastos
        {'name': 'Alimentación', 'description': 'Comida y bebidas', 'color': '#fd7e14', 'icon': 'utensils'},
        {'name': 'Transporte', 'description': 'Gasolina, transporte público, taxi', 'color': '#20c997', 'icon': 'car'},
        {'name': 'Vivienda', 'description': 'Renta, servicios, mantenimiento', 'color': '#6c757d', 'icon': 'home'},
        {'name': 'Salud', 'description': 'Medicinas, doctores, seguros', 'color': '#dc3545', 'icon': 'heart'},
        {'name': 'Entretenimiento', 'description': 'Cine, juegos, diversión', 'color': '#6610f2', 'icon': 'gamepad2'},
        {'name': 'Educación', 'description': 'Cursos, libros, materiales', 'color': '#0dcaf0', 'icon': 'book'},
        {'name': 'Ropa', 'description': 'Vestimenta y accesorios', 'color': '#fd7e14', 'icon': 'shopping-bag'},
        {'name': 'Tecnología', 'description': 'Dispositivos, software, internet', 'color': '#0d6efd', 'icon': 'smartphone'},
        {'name': 'Ahorro', 'description': 'Dinero guardado para el futuro', 'color': '#198754', 'icon': 'piggy-bank'},
        {'name': 'Otros Gastos', 'description': 'Otros tipos de gastos', 'color': '#6c757d', 'icon': 'minus-circle'},
    ]
    
    created_count = 0
    for cat_data in categories:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={
                'description': cat_data['description'],
                'color': cat_data['color'],
                'icon': cat_data['icon']
            }
        )
        if created:
            created_count += 1
            print(f"  Categoria creada: {category.name}")
        else:
            print(f"  Categoria ya existe: {category.name}")
    
    print(f"Total categorias creadas: {created_count}")

def create_achievements():
    """Crear logros iniciales"""
    print("Creando logros...")
    
    achievements = [
        {
            'name': 'Primera Transacción',
            'description': 'Realiza tu primera transacción',
            'icon': 'star',
            'points': 10,
            'condition_type': 'first_transaction',
            'condition_value': 1
        },
        {
            'name': 'Ahorrador Inicial',
            'description': 'Ahorra tu primer peso',
            'icon': 'coin',
            'points': 15,
            'condition_type': 'first_saving',
            'condition_value': 1
        },
        {
            'name': 'Meta Cumplida',
            'description': 'Completa tu primera meta de ahorro',
            'icon': 'target',
            'points': 25,
            'condition_type': 'first_goal',
            'condition_value': 1
        },
        {
            'name': 'Gran Ahorrador',
            'description': 'Ahorra $1,000 pesos',
            'icon': 'trending-up',
            'points': 50,
            'condition_type': 'savings_milestone',
            'condition_value': 1000
        },
        {
            'name': 'Control Total',
            'description': 'Registra 100 transacciones',
            'icon': 'check-circle',
            'points': 30,
            'condition_type': 'transaction_count',
            'condition_value': 100
        },
    ]
    
    created_count = 0
    for ach_data in achievements:
        achievement, created = Achievement.objects.get_or_create(
            name=ach_data['name'],
            defaults={
                'description': ach_data['description'],
                'icon': ach_data['icon'],
                'points': ach_data['points'],
                'condition_type': ach_data['condition_type'],
                'condition_value': ach_data['condition_value'],
                'is_active': True
            }
        )
        if created:
            created_count += 1
            print(f"  Logro creado: {achievement.name}")
        else:
            print(f"  Logro ya existe: {achievement.name}")
    
    print(f"Total logros creados: {created_count}")

def create_demo_user():
    """Crear usuario de demostración"""
    print("Creando usuario de demostracion...")
    
    demo_user, created = Usuario.objects.get_or_create(
        correo='demo@ahorra-oink.com',
        defaults={
            'nombrecompleto': 'Usuario Demo',
            'contraseniaencriptada': make_password('demo123')
        }
    )
    
    if created:
        print(f"  Usuario demo creado: {demo_user.correo}")
        print(f"  Email: demo@ahorra-oink.com")
        print(f"  Contraseña: demo123")
    else:
        print(f"  Usuario demo ya existe: {demo_user.correo}")
    
    return demo_user

def main():
    """Función principal"""
    print("Poblando base de datos con datos iniciales...")
    print("=" * 50)
    
    try:
        # Crear categorías
        create_categories()
        print()
        
        # Crear logros
        create_achievements()
        print()
        
        # Crear usuario demo
        create_demo_user()
        print()
        
        print("=" * 50)
        print("Base de datos poblada exitosamente!")
        print()
        print("Datos creados:")
        print(f"  - {Category.objects.count()} categorias")
        print(f"  - {Achievement.objects.count()} logros")
        print(f"  - {Usuario.objects.count()} usuarios")
        print()
        print("Puedes probar la aplicacion con:")
        print("  Email: demo@ahorra-oink.com")
        print("  Contraseña: demo123")
        
    except Exception as e:
        print(f"Error poblando la base de datos: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()








