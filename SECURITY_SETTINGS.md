# 🔒 Configuración de Seguridad

## Niveles de Seguridad Disponibles

### 🟢 **Desarrollo (Actual)**
- ✅ Encriptación de credenciales activa
- ✅ Detección básica de DevTools (solo mensajes informativos)
- ✅ Protección básica contra debugging
- ❌ Bloqueo de clic derecho (deshabilitado)
- ❌ Bloqueo de console (deshabilitado)
- ❌ Ofuscación agresiva (deshabilitada)

### 🟡 **Intermedio**
- ✅ Encriptación de credenciales
- ✅ Detección de DevTools con advertencias
- ✅ Bloqueo de clic derecho
- ✅ Bloqueo de selección de texto
- ❌ Bloqueo completo de console
- ❌ Ofuscación agresiva

### 🔴 **Producción (Máxima Seguridad)**
- ✅ Encriptación de credenciales
- ✅ Detección agresiva de DevTools
- ✅ Bloqueo completo de console
- ✅ Bloqueo de clic derecho
- ✅ Bloqueo de selección de texto
- ✅ Ofuscación completa de código
- ✅ Protección de archivos fuente
- ✅ Anti-debugging agresivo

## 🚀 Cómo Cambiar el Nivel de Seguridad

### Para Desarrollo (Recomendado):
```bash
npm run dev
```

### Para Producción con Seguridad Máxima:
```bash
npm run build
# o
build_ultra_secure.bat
```

## 📋 Estado Actual

**Modo**: Desarrollo
**Seguridad**: Básica
**Funcionalidad**: Completa
**Inspección**: Permitida (con mensajes informativos)

## 🔧 Personalización

Para cambiar el nivel de seguridad, edita el archivo:
`frontend/src/utils/security.js`

En la función `initSecurity()`, puedes modificar:
- `isProduction`: Cambia entre desarrollo y producción
- Medidas específicas de seguridad

## ✅ Verificación

1. **Abre** `http://localhost:5173`
2. **Verifica** que la página carga correctamente
3. **Abre DevTools** (F12) - Deberías ver mensajes informativos
4. **Haz clic derecho** - Debería funcionar normalmente
5. **Selecciona texto** - Debería funcionar normalmente
6. **Console** - Debería funcionar normalmente

## 🎯 Resultado

- ✅ **Página carga correctamente**
- ✅ **Login funciona con encriptación**
- ✅ **DevTools detectado pero no bloqueado**
- ✅ **Funcionalidad completa disponible**
- ✅ **Seguridad básica activa**

---

**Nota**: En modo desarrollo, las medidas de seguridad son menos agresivas para permitir el debugging y desarrollo normal. En producción, se activan todas las protecciones.
