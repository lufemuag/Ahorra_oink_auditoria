# 🔐 Guía de Encriptación de Credenciales - Ahorra Oink

## 📋 Resumen

Se ha implementado un sistema de encriptación de credenciales que protege las credenciales de login durante el tránsito por la red, evitando que sean visibles en texto plano en las herramientas de desarrollo del navegador.

## 🛡️ Características de Seguridad

### ✅ **Protección Implementada:**
- **Encriptación de credenciales** antes del envío por red
- **Payload encriptado** que no muestra credenciales en texto plano
- **Timestamp único** que previene ataques de replay
- **Clave de verificación** que previene manipulación
- **Desencriptación segura** en el backend
- **Validación de integridad** de datos

### 🔒 **Algoritmo de Encriptación:**
- **Cifrado por desplazamiento** (shift cipher) modificado
- **Clave basada en hash** de la clave maestra + timestamp
- **Módulo 95** para caracteres imprimibles (ASCII 32-126)
- **Shift variable** por posición del carácter

## 📊 Comparación: Antes vs Después

### **❌ ANTES (Inseguro):**
```json
{
  "username": "kiritosama@pascualbravo.edu.co",
  "password": "Qweas132"
}
```

### **✅ DESPUÉS (Seguro):**
```json
{
  "u": ".-7/;7<+8-l>0C4G4@7H8NHg@@RkBO",
  "p": "s;*':X[[",
  "t": "1759469280343",
  "k": "e9064f97"
}
```

## 🔧 Implementación Técnica

### **Frontend (React):**
- **Archivo**: `src/utils/encryption.js`
- **Función principal**: `encryptCredentials(username, password)`
- **Integración**: `src/services/authService.js`

### **Backend (Django):**
- **Archivo**: `accounts/encryption_utils.py`
- **Función principal**: `decrypt_credentials(encrypted_data)`
- **Integración**: `accounts/views.py` (LoginView)

## 🚀 Flujo de Encriptación

### **1. Frontend (Encriptación):**
```javascript
// Usuario ingresa credenciales
const username = "kiritosama@pascualbravo.edu.co";
const password = "Qweas132";

// Se encriptan antes del envío
const encryptedPayload = encryptCredentials(username, password);
// Resultado: { u: ".-7/;7<+8-l>0C4G4@7H8NHg@@RkBO", p: "s;*':X[[", t: "1759469280343", k: "e9064f97" }

// Se envía el payload encriptado
fetch('/api/auth/login/', {
  method: 'POST',
  body: JSON.stringify(encryptedPayload)
});
```

### **2. Backend (Desencriptación):**
```python
# Se recibe el payload encriptado
encrypted_data = request.data  # { u: "...", p: "...", t: "...", k: "..." }

# Se desencriptan las credenciales
decrypted_creds = decrypt_credentials(encrypted_data)
# Resultado: { username: "kiritosama@pascualbravo.edu.co", password: "Qweas132" }

# Se procede con la autenticación normal
serializer = LoginUsuarioSerializer(data=decrypted_creds)
```

## 🔍 Verificación de Seguridad

### **Prueba Manual:**
1. Abrir las herramientas de desarrollo del navegador
2. Ir a la pestaña "Network"
3. Intentar hacer login
4. Verificar que en el payload **NO** aparezcan las credenciales en texto plano

### **Prueba Automatizada:**
```bash
# Ejecutar el script de prueba
python test_encryption.py
```

## ⚠️ Limitaciones y Consideraciones

### **🔒 Lo que SÍ protege:**
- Credenciales en tránsito por la red
- Inspección casual en herramientas de desarrollo
- Ataques de replay (timestamp)
- Manipulación básica del payload

### **⚠️ Lo que NO protege:**
- **No es seguridad real** - solo dificulta la inspección
- **No previene ataques avanzados** de ingeniería inversa
- **No protege contra usuarios técnicos** que conozcan el algoritmo
- **No reemplaza HTTPS** - siempre usar HTTPS en producción

### **🎯 Recomendaciones:**
1. **Usar HTTPS** en producción (obligatorio)
2. **Mantener la clave de encriptación** segura
3. **Rotar la clave** periódicamente
4. **Monitorear logs** de intentos de acceso
5. **Implementar rate limiting** en el backend

## 🔧 Configuración

### **Clave de Encriptación:**
```javascript
// Frontend: src/utils/encryption.js
const ENCRYPTION_KEY = 'ahorra-oink-secure-key-2025';
```

```python
# Backend: accounts/encryption_utils.py
ENCRYPTION_KEY = 'ahorra-oink-secure-key-2025'
```

### **Tiempo de Expiración:**
- **5 minutos** para payloads encriptados
- Previene ataques de replay
- Configurable en `encryption_utils.py`

## 📈 Beneficios de Seguridad

### **1. Protección de Credenciales:**
- Las credenciales no son visibles en texto plano
- Dificulta la interceptación casual
- Protege contra inspección básica

### **2. Prevención de Ataques:**
- **Replay attacks**: Timestamp único
- **Manipulación**: Clave de verificación
- **Interceptación**: Encriptación del payload

### **3. Cumplimiento:**
- Mejores prácticas de seguridad
- Protección de datos sensibles
- Auditoría de seguridad mejorada

## 🚨 Alertas de Seguridad

### **Si ves credenciales en texto plano:**
1. Verificar que la encriptación esté activa
2. Revisar la consola del navegador por errores
3. Confirmar que el backend esté desencriptando correctamente

### **Si el login falla:**
1. Verificar que las claves de encriptación coincidan
2. Revisar los logs del backend
3. Confirmar que el timestamp no haya expirado

## 📞 Soporte

Si encuentras problemas con la encriptación:
1. Revisar los logs del backend
2. Verificar la consola del navegador
3. Ejecutar `python test_encryption.py` para diagnóstico
4. Contactar al equipo de desarrollo

---

**⚠️ IMPORTANTE**: Esta encriptación es una medida de protección adicional, pero **NO reemplaza** las medidas de seguridad fundamentales como HTTPS, validación del servidor, y autenticación robusta.
