#!/usr/bin/env python3
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

def create_admin_user():
    username = 'admin'
    email = 'admin@ahorraoink.com'
    password = 'admin123'
    
    # Verificar si el usuario ya existe
    if User.objects.filter(username=username).exists():
        print(f"El usuario '{username}' ya existe.")
        # Actualizar la contraseña
        user = User.objects.get(username=username)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"Contraseña actualizada para el usuario '{username}'")
    else:
        # Crear nuevo superusuario
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print(f"Superusuario '{username}' creado exitosamente.")
    
    print(f"Credenciales del administrador:")
    print(f"Usuario: {username}")
    print(f"Contraseña: {password}")
    print(f"Email: {email}")

if __name__ == '__main__':
    create_admin_user()
