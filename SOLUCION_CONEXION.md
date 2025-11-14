# 🔧 Solución al Error de Conexión

## 🚨 Problema Actual

**Error**: `ERR_CONNECTION_REFUSED` - localhost rechazó la conexión

## 🔍 Diagnóstico

- ✅ **Backend Django**: Funcionando correctamente en puerto 8000
- ❌ **Frontend Vite**: No se está iniciando en puerto 5173

## 🛠️ Soluciones Paso a Paso

### **Opción 1: Iniciar Servidores Manualmente**

#### **Terminal 1 - Backend Django:**
```bash
cd "C:\Users\kirit\OneDrive\Escritorio\lufemuag_PG\lufemuag-ahorra-oink\lufemuag-ahorra-oink"
python backend/manage.py runserver 127.0.0.1:8000
```

#### **Terminal 2 - Frontend Vite:**
```bash
cd "C:\Users\kirit\OneDrive\Escritorio\lufemuag_PG\lufemuag-ahorra-oink\lufemuag-ahorra-oink\frontend"
npm run dev
```

### **Opción 2: Usar el Script de Inicio**

```bash
cd "C:\Users\kirit\OneDrive\Escritorio\lufemuag_PG\lufemuag-ahorra-oink\lufemuag-ahorra-oink"
python start_servers_simple.py
```

### **Opción 3: Verificar Dependencias**

#### **Verificar Node.js:**
```bash
node --version
npm --version
```

#### **Instalar Dependencias del Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Verificación

Una vez iniciados los servidores, verifica:

1. **Backend**: http://127.0.0.1:8000/api/ (debe mostrar 404 - esto es normal)
2. **Frontend**: http://localhost:5173/ (debe mostrar la aplicación)

## 🎯 Credenciales de Prueba

Una vez que funcione la conexión:
- **Email**: `test@test.com`
- **Password**: `Test123456`

## 🔧 Solución Rápida

Si nada funciona, ejecuta estos comandos en orden:

```bash
# 1. Ir al directorio del proyecto
cd "C:\Users\kirit\OneDrive\Escritorio\lufemuag_PG\lufemuag-ahorra-oink\lufemuag-ahorra-oink"

# 2. Iniciar backend
start cmd /k "python backend/manage.py runserver 127.0.0.1:8000"

# 3. Iniciar frontend
start cmd /k "cd frontend && npm run dev"
```

## 📋 Estado Actual

- ✅ Backend Django: Funcionando
- ❌ Frontend Vite: Necesita iniciarse manualmente
- ✅ Usuario de prueba: Creado y verificado
- ✅ Login: Funcionando cuando ambos servidores están activos

## 🚀 Próximos Pasos

1. **Iniciar ambos servidores** usando una de las opciones arriba
2. **Acceder a** http://localhost:5173
3. **Hacer login** con las credenciales de prueba
4. **Verificar** que no hay más errores de conexión

---

**Nota**: El error de conexión se debe a que el frontend no está ejecutándose. Una vez iniciado, la aplicación funcionará correctamente.




