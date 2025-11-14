# 🚀 INSTRUCCIONES PARA EJECUTAR AHORRA OINK

## 📋 Requisitos Previos

### ✅ XAMPP (Ya configurado)
- **Apache**: Puerto 80 ✅
- **MySQL**: Puerto 3306 ✅
- **phpMyAdmin**: http://localhost/phpmyadmin ✅

### ✅ Entorno Virtual Python
- Entorno virtual creado y activado ✅
- Todas las dependencias instaladas ✅

## 🎯 Formas de Ejecutar el Proyecto

### **Opción 1: Ejecutar Todo Junto (Recomendado)**

```bash
# Método 1: Usando el script Python
python start_all.py

# Método 2: Usando el archivo batch (Windows)
start_project.bat
```

### **Opción 2: Ejecutar Servicios por Separado**

#### **Terminal 1 - Backend Django:**
```bash
python start_backend.py
# O manualmente:
cd backend
python manage.py runserver 127.0.0.1:8000
```

#### **Terminal 2 - Frontend React:**
```bash
python start_frontend.py
# O manualmente:
cd frontend
npm run dev
```

## 🌐 URLs de Acceso

Una vez ejecutado el proyecto, tendrás acceso a:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación React principal |
| **Backend API** | http://localhost:8000/api/ | API REST de Django |
| **Admin Django** | http://localhost:8000/admin/ | Panel de administración |
| **phpMyAdmin** | http://localhost/phpmyadmin | Gestión de base de datos |
| **Base de Datos** | localhost:3306 | MySQL/MariaDB |

## 🔧 Configuración de Puertos

### **XAMPP (Ya configurado):**
- **Apache**: Puerto 80 (http://localhost)
- **MySQL**: Puerto 3306
- **phpMyAdmin**: http://localhost/phpmyadmin

### **Proyecto:**
- **Backend Django**: Puerto 8000 (http://localhost:8000)
- **Frontend React**: Puerto 5173 (http://localhost:5173)

## 📊 Base de Datos

### **Tablas Creadas:**
- ✅ `users` - Usuarios del sistema
- ✅ `categories` - Categorías de transacciones
- ✅ `transactions` - Transacciones (ingresos/gastos)
- ✅ `savings_goals` - Metas de ahorro
- ✅ `achievements` - Logros desbloqueados
- ✅ `notifications` - Notificaciones del sistema

### **Verificar Base de Datos:**
```bash
# Crear/verificar tablas
python create_tables.py

# Ver en phpMyAdmin
http://localhost/phpmyadmin/index.php?route=/database/structure&db=ahorra_oink
```

## 🛠️ Comandos Útiles

### **Verificar Estado:**
```bash
# Verificar puertos ocupados
netstat -an | findstr ":80 :443 :3306 :8000 :5173"

# Verificar Django
cd backend
python manage.py check

# Verificar frontend
cd frontend
npm run build
```

### **Reiniciar Servicios:**
```bash
# Detener: Ctrl+C en cada terminal
# Reiniciar: Ejecutar nuevamente los scripts
```

## 🔍 Solución de Problemas

### **Error: Puerto ocupado**
```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Detener proceso si es necesario
taskkill /PID [número_del_proceso] /F
```

### **Error: Base de datos no conecta**
1. Verificar que XAMPP esté ejecutándose
2. Verificar que MySQL esté en puerto 3306
3. Ejecutar: `python create_tables.py`

### **Error: Frontend no carga**
1. Verificar que las dependencias estén instaladas: `npm install`
2. Verificar que el puerto 5173 esté libre
3. Limpiar caché: `npm run build`

## 📱 Flujo de Trabajo Recomendado

1. **Iniciar XAMPP** (Apache + MySQL)
2. **Activar entorno virtual**: `.\venv\Scripts\Activate.ps1`
3. **Ejecutar proyecto**: `python start_all.py`
4. **Abrir navegador**: http://localhost:5173
5. **Desarrollar** en el frontend y backend simultáneamente

## 🎉 ¡Listo para Desarrollar!

Tu proyecto está completamente configurado y listo para usar:

- ✅ **Backend Django** funcionando en puerto 8000
- ✅ **Frontend React** funcionando en puerto 5173
- ✅ **Base de datos MySQL** funcionando en puerto 3306
- ✅ **phpMyAdmin** disponible en puerto 80
- ✅ **CORS configurado** para comunicación entre frontend y backend
- ✅ **Proxy configurado** en Vite para las APIs

**¡Disfruta desarrollando tu aplicación de ahorro! 🐷💰**
