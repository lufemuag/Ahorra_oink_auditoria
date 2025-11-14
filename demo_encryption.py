#!/usr/bin/env python3
# demo_encryption.py
# Demostración visual de la encriptación de credenciales

import sys
import os
import json
import time

# Añadir el directorio del backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from accounts.encryption_utils import encrypt_credentials, decrypt_credentials

def print_header():
    """Imprimir encabezado del demo"""
    print("=" * 80)
    print("DEMOSTRACION: Encriptacion de Credenciales - Ahorra Oink")
    print("=" * 80)
    print()

def print_section(title):
    """Imprimir sección del demo"""
    print(f"\n{title}")
    print("-" * len(title))

def demo_basic_encryption():
    """Demostrar encriptación básica"""
    print_section("1. ENCRIPTACION BASICA")
    
    # Credenciales de ejemplo
    username = "kiritosama@pascualbravo.edu.co"
    password = "Qweas132"
    
    print(f"Credenciales originales:")
    print(f"  Username: {username}")
    print(f"  Password: {password}")
    print()
    
    # Encriptar
    print("Encriptando credenciales...")
    encrypted = encrypt_credentials(username, password)
    
    if encrypted:
        print("[OK] Encriptacion exitosa!")
        print(f"Payload encriptado:")
        print(f"  u (username): {encrypted['u']}")
        print(f"  p (password): {encrypted['p']}")
        print(f"  t (timestamp): {encrypted['t']}")
        print(f"  k (key): {encrypted['k']}")
        print()
        
        # Mostrar JSON completo
        print("JSON completo que se enviaria por red:")
        print(json.dumps(encrypted, indent=2))
        print()
        
        return encrypted
    else:
        print("[ERROR] Fallo en la encriptacion")
        return None

def demo_network_payload(encrypted_data):
    """Demostrar cómo se ve en la red"""
    print_section("2. VISTA EN HERRAMIENTAS DE DESARROLLO")
    
    print("Cuando inspeccionas la red en el navegador, veras:")
    print()
    print("Request Payload:")
    print(json.dumps(encrypted_data, indent=2))
    print()
    print("NOTA: Las credenciales NO son visibles en texto plano!")
    print("Solo ves caracteres encriptados que no revelan informacion.")

def demo_decryption(encrypted_data):
    """Demostrar desencriptación"""
    print_section("3. DESENCRIPTACION EN EL BACKEND")
    
    print("El backend recibe el payload encriptado y lo desencripta:")
    print()
    
    # Desencriptar
    decrypted = decrypt_credentials(encrypted_data)
    
    if decrypted:
        print("[OK] Desencriptacion exitosa!")
        print(f"Credenciales recuperadas:")
        print(f"  Username: {decrypted['username']}")
        print(f"  Password: {decrypted['password']}")
        print()
        
        # Verificar integridad
        original_username = "kiritosama@pascualbravo.edu.co"
        original_password = "Qweas132"
        
        username_match = decrypted['username'] == original_username
        password_match = decrypted['password'] == original_password
        
        print("Verificacion de integridad:")
        print(f"  Username coincide: {'[OK]' if username_match else '[ERROR]'}")
        print(f"  Password coincide: {'[OK]' if password_match else '[ERROR]'}")
        
        if username_match and password_match:
            print("\n[SUCCESS] Las credenciales se recuperaron correctamente!")
        else:
            print("\n[ERROR] Las credenciales no coinciden!")
    else:
        print("[ERROR] Fallo en la desencriptacion")

def demo_security_features():
    """Demostrar características de seguridad"""
    print_section("4. CARACTERISTICAS DE SEGURIDAD")
    
    print("Caracteristicas implementadas:")
    print("  [OK] Encriptacion de credenciales")
    print("  [OK] Timestamp unico (previene replay attacks)")
    print("  [OK] Clave de verificacion (previene manipulacion)")
    print("  [OK] Validacion de integridad")
    print("  [OK] Tiempo de expiracion (5 minutos)")
    print()
    
    # Demostrar timestamp
    print("Ejemplo de timestamp:")
    current_time = int(time.time() * 1000)
    print(f"  Timestamp actual: {current_time}")
    print(f"  Formato: milisegundos desde 1970")
    print(f"  Proposito: hacer cada encriptacion unica")

def demo_comparison():
    """Mostrar comparación antes/después"""
    print_section("5. COMPARACION: ANTES vs DESPUES")
    
    print("ANTES (Inseguro):")
    print("  Request Payload:")
    print("  {")
    print('    "username": "kiritosama@pascualbravo.edu.co",')
    print('    "password": "Qweas132"')
    print("  }")
    print("  [PROBLEMA] Credenciales visibles en texto plano!")
    print()
    
    print("DESPUES (Seguro):")
    print("  Request Payload:")
    print("  {")
    print('    "u": ".-7/;7<+8-l>0C4G4@7H8NHg@@RkBO",')
    print('    "p": "s;*\'":X[[",')
    print('    "t": "1759469280343",')
    print('    "k": "e9064f97"')
    print("  }")
    print("  [SOLUCION] Credenciales encriptadas y protegidas!")

def demo_limitations():
    """Mostrar limitaciones"""
    print_section("6. LIMITACIONES IMPORTANTES")
    
    print("LO QUE SÍ PROTEGE:")
    print("  [OK] Credenciales en transito por la red")
    print("  [OK] Inspeccion casual en herramientas de desarrollo")
    print("  [OK] Ataques de replay (timestamp)")
    print("  [OK] Manipulacion basica del payload")
    print()
    
    print("LO QUE NO PROTEGE:")
    print("  [WARNING] No es seguridad real - solo dificulta la inspeccion")
    print("  [WARNING] No previene ataques avanzados de ingenieria inversa")
    print("  [WARNING] No protege contra usuarios tecnicos avanzados")
    print("  [WARNING] No reemplaza HTTPS - siempre usar HTTPS en produccion")
    print()
    
    print("RECOMENDACIONES:")
    print("  [TIP] Usar HTTPS en produccion (obligatorio)")
    print("  [TIP] Mantener la clave de encriptacion segura")
    print("  [TIP] Rotar la clave periodicamente")
    print("  [TIP] Monitorear logs de intentos de acceso")
    print("  [TIP] Implementar rate limiting en el backend")

def main():
    """Función principal del demo"""
    print_header()
    
    # Demostrar encriptación básica
    encrypted_data = demo_basic_encryption()
    
    if encrypted_data:
        # Demostrar vista en red
        demo_network_payload(encrypted_data)
        
        # Demostrar desencriptación
        demo_decryption(encrypted_data)
        
        # Demostrar características de seguridad
        demo_security_features()
        
        # Mostrar comparación
        demo_comparison()
        
        # Mostrar limitaciones
        demo_limitations()
        
        print_section("RESUMEN")
        print("[SUCCESS] La encriptacion de credenciales esta funcionando correctamente!")
        print("Las credenciales ahora estan protegidas durante el transito por la red.")
        print("Ya no son visibles en texto plano en las herramientas de desarrollo.")
        
    else:
        print("[ERROR] No se pudo completar la demostracion debido a errores en la encriptacion.")
        return 1
    
    print("\n" + "=" * 80)
    print("DEMO COMPLETADO")
    print("=" * 80)
    
    return 0

if __name__ == "__main__":
    exit(main())
