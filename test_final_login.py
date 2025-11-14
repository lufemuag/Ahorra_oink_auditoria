#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script final para probar el login después del reinicio
"""

import requests
import json
import time

def test_login():
    """Probar login después del reinicio"""
    print("=== PRUEBA FINAL DE LOGIN ===")
    
    # Esperar un momento para que los servidores se inicien
    print("Esperando que los servidores se inicien...")
    time.sleep(5)
    
    # URL del endpoint
    url = "http://localhost:8000/api/auth/login/"
    
    # Credenciales
    username = "admin@pascualbravo.edu.co"
    password = "admin123"
    
    print(f"Probando login con:")
    print(f"  Username: {username}")
    print(f"  Password: {password}")
    print()
    
    # Headers
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    # Payload normal (sin encriptación para esta prueba)
    payload = {
        'username': username,
        'password': password
    }
    
    try:
        print("Enviando petición...")
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2, ensure_ascii=False)}")
        except:
            print(f"Response Text: {response.text}")
        
        if response.status_code == 200 and response_data.get('success'):
            print("✅ SUCCESS: Login exitoso")
            print(f"Token recibido: {'Sí' if response_data.get('token') else 'No'}")
            print(f"Usuario: {response_data.get('user', {}).get('correo', 'N/A')}")
            return True
        else:
            print(f"❌ ERROR: Login falló con status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ ERROR de conexión: {e}")
        return False

def test_server_status():
    """Probar estado de los servidores"""
    print("=== VERIFICANDO ESTADO DE SERVIDORES ===")
    
    # Probar backend
    try:
        response = requests.get("http://localhost:8000/api/auth/me/", timeout=5)
        print(f"Backend (puerto 8000): {'✅ Activo' if response.status_code in [200, 401] else '❌ Error'}")
    except:
        print("Backend (puerto 8000): ❌ No responde")
    
    # Probar frontend
    try:
        response = requests.get("http://localhost:5173/", timeout=5)
        print(f"Frontend (puerto 5173): {'✅ Activo' if response.status_code == 200 else '❌ Error'}")
    except:
        print("Frontend (puerto 5173): ❌ No responde")

if __name__ == "__main__":
    print("INICIANDO PRUEBA FINAL DESPUÉS DEL REINICIO...")
    print("=" * 50)
    
    test_server_status()
    print()
    test_login()
    
    print("\n" + "=" * 50)
    print("PRUEBA COMPLETADA")
    print("\nInstrucciones:")
    print("1. Abre tu navegador en http://localhost:5173")
    print("2. Intenta hacer login con:")
    print("   - Usuario: admin (o admin@pascualbravo.edu.co)")
    print("   - Contraseña: admin123")
    print("3. Si sigue fallando, revisa la consola del navegador (F12)")
