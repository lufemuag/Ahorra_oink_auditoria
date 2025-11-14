# accounts/encryption_utils.py
# Utilidades de encriptación para el backend Django

import time
import hashlib

# Clave de encriptación (debe coincidir con el frontend)
ENCRYPTION_KEY = 'ahorra-oink-secure-key-2025'

def generate_hash(text):
    """Generar hash simple pero efectivo"""
    hash_val = 0
    for char in text:
        hash_val = ((hash_val << 5) - hash_val) + ord(char)
        hash_val = hash_val & hash_val  # Convertir a 32-bit integer
    return hex(abs(hash_val))[2:]

def encrypt_text(text, key):
    """Encriptar texto usando cifrado simple pero efectivo"""
    if not text:
        return ''
    
    key_hash = generate_hash(key)
    key_num = int(key_hash[:8], 16) or 1
    
    encrypted = ''
    for i, char in enumerate(text):
        char_code = ord(char)
        # Usar un shift más simple y predecible
        shift = (key_num + i) % 95  # Usar módulo 95 para caracteres imprimibles
        
        # Aplicar el shift a todos los caracteres de manera uniforme
        new_code = (char_code - 32 + shift) % 95 + 32
        encrypted += chr(new_code)
    
    return encrypted

def decrypt_text(encrypted_text, key):
    """Desencriptar texto"""
    if not encrypted_text:
        return ''
    
    key_hash = generate_hash(key)
    key_num = int(key_hash[:8], 16) or 1
    
    decrypted = ''
    for i, char in enumerate(encrypted_text):
        char_code = ord(char)
        # Usar el mismo shift que en la encriptación
        shift = (key_num + i) % 95  # Usar módulo 95 para caracteres imprimibles
        
        # Revertir el shift aplicado en la encriptación
        original_code = (char_code - 32 - shift + 95) % 95 + 32
        decrypted += chr(original_code)
    
    return decrypted

def encrypt_credentials(username, password):
    """Encriptar credenciales de login"""
    try:
        # Crear un timestamp para hacer la encriptación única
        timestamp = str(int(time.time() * 1000))
        combined_key = ENCRYPTION_KEY + timestamp
        
        # Encriptar username y password
        encrypted_username = encrypt_text(username, combined_key)
        encrypted_password = encrypt_text(password, combined_key)
        
        # Crear payload encriptado
        encrypted_payload = {
            'u': encrypted_username,  # username encriptado
            'p': encrypted_password,  # password encriptado
            't': timestamp,           # timestamp para desencriptación
            'k': generate_hash(combined_key)[:8]  # clave de verificación
        }
        
        return encrypted_payload
    except Exception as e:
        print(f"Error encrypting credentials: {e}")
        return None

def decrypt_credentials(encrypted_data):
    """Desencriptar credenciales del frontend"""
    try:
        if not encrypted_data or not all(key in encrypted_data for key in ['u', 'p', 't', 'k']):
            return None
        
        # Verificar timestamp (no muy antiguo)
        timestamp = int(encrypted_data['t'])
        current_time = int(time.time() * 1000)
        max_age = 5 * 60 * 1000  # 5 minutos
        
        if current_time - timestamp > max_age:
            return None
        
        # Generar clave combinada
        combined_key = ENCRYPTION_KEY + encrypted_data['t']
        
        # Verificar clave de verificación
        expected_key = generate_hash(combined_key)[:8]
        received_key = encrypted_data['k']
        
        if received_key != expected_key:
            return None
        
        # Desencriptar username y password
        username = decrypt_text(encrypted_data['u'], combined_key)
        password = decrypt_text(encrypted_data['p'], combined_key)
        
        return {
            'username': username,
            'password': password
        }
    except Exception as e:
        return None

def validate_encrypted_data(encrypted_data):
    """Validar la integridad de los datos encriptados"""
    try:
        if not encrypted_data or not isinstance(encrypted_data, dict):
            return False
        
        # Verificar que tenga los campos necesarios
        required_fields = ['u', 'p', 't', 'k']
        for field in required_fields:
            if field not in encrypted_data:
                return False
        
        # Verificar que el timestamp sea válido (no muy antiguo)
        timestamp = int(encrypted_data['t'])
        current_time = int(time.time() * 1000)
        max_age = 5 * 60 * 1000  # 5 minutos
        
        if current_time - timestamp > max_age:
            return False
        
        return True
    except Exception as e:
        print(f"Error validating encrypted data: {e}")
        return False

def generate_session_token():
    """Generar un token de sesión seguro"""
    timestamp = str(int(time.time() * 1000))
    random_str = hashlib.md5(str(time.time()).encode()).hexdigest()[:8]
    combined = timestamp + random_str
    
    return generate_hash(combined)

def encrypt_sensitive_data(data, custom_key=None):
    """Encriptar cualquier dato sensible"""
    try:
        key = custom_key or ENCRYPTION_KEY
        import json
        json_string = json.dumps(data)
        encrypted = encrypt_text(json_string, key)
        
        return {
            'data': encrypted,
            'key': generate_hash(key)[:8]
        }
    except Exception as e:
        print(f"Error encrypting sensitive data: {e}")
        return None

def decrypt_sensitive_data(encrypted_data, custom_key=None):
    """Desencriptar datos sensibles"""
    try:
        key = custom_key or ENCRYPTION_KEY
        expected_key = generate_hash(key)[:8]
        
        if encrypted_data['key'] != expected_key:
            return None
        
        decrypted = decrypt_text(encrypted_data['data'], key)
        import json
        return json.loads(decrypted)
    except Exception as e:
        print(f"Error decrypting sensitive data: {e}")
        return None
