# 🗄️ Configuración de Base de Datos - Ahorra Oink

## 📋 Resumen

Este proyecto está configurado para trabajar con **MySQL/MariaDB** y soporta múltiples frameworks:
- **Flask** con Flask-SQLAlchemy
- **Django** con Django ORM
- **FastAPI** con SQLAlchemy

## 🚀 Instalación Rápida

### 1. Crear Entorno Virtual
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # Linux/Mac
```

### 2. Instalar Dependencias
```bash
pip install -r requirements_mysql.txt
```

### 3. Configurar Base de Datos
Edita el archivo `database_config.env` con tus credenciales:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ahorra_oink
DB_USER=root
DB_PASSWORD=tu_password
```

### 4. Crear Tablas
```bash
python create_tables.py
```

## 📊 Estructura de la Base de Datos

### Tablas Creadas:

1. **`users`** - Usuarios del sistema
   - `id`, `username`, `email`, `password_hash`
   - `first_name`, `last_name`, `is_active`, `is_admin`
   - `created_at`, `updated_at`

2. **`categories`** - Categorías de transacciones
   - `id`, `name`, `description`, `color`, `icon`
   - `is_active`, `created_at`, `updated_at`

3. **`transactions`** - Transacciones (ingresos/gastos)
   - `id`, `user_id`, `category_id`, `type`, `amount`
   - `description`, `date`, `created_at`, `updated_at`

4. **`savings_goals`** - Metas de ahorro
   - `id`, `user_id`, `name`, `target_amount`, `current_amount`
   - `target_date`, `description`, `is_completed`
   - `created_at`, `updated_at`

5. **`achievements`** - Logros desbloqueados
   - `id`, `user_id`, `name`, `description`, `icon`
   - `unlocked_at`

6. **`notifications`** - Notificaciones del sistema
   - `id`, `user_id`, `title`, `message`, `type`
   - `is_read`, `created_at`

## 🔧 Configuración por Framework

### Flask
```python
from flask_database_config import config
app.config.from_object(config['development'])
```

### Django
```python
from django_database_config import DATABASES, SECRET_KEY, DEBUG
# Usar en settings.py
```

### FastAPI
```python
from fastapi_database_config import engine, SessionLocal, Base, get_db
# Usar en main.py
```

## 📝 Scripts Disponibles

### Scripts de Migración:
- `create_tables.py` - Crear tablas básicas (✅ Funcionando)
- `migrate_django_simple.py` - Migraciones Django
- `migrate_flask_simple.py` - Migraciones Flask
- `migrate_fastapi_simple.py` - Migraciones FastAPI
- `migrate_all_simple.py` - Ejecutar todas las migraciones

### Comandos Útiles:

#### Verificar Conexión:
```bash
python -c "import pymysql; print('✅ MySQL driver instalado')"
```

#### Ver Tablas en phpMyAdmin:
```
http://localhost/phpmyadmin/index.php?route=/database/structure&db=ahorra_oink
```

#### Conectar desde Python:
```python
import pymysql
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    database='ahorra_oink',
    charset='utf8mb4'
)
```

## 🎯 Próximos Pasos

1. **Configurar tu aplicación** usando los archivos de configuración
2. **Crear modelos** en tu framework preferido
3. **Ejecutar migraciones** específicas del framework
4. **Desarrollar APIs** para interactuar con la base de datos

## 🔍 Verificación

Para verificar que todo funciona:

1. ✅ **Conexión a MySQL**: `python create_tables.py`
2. ✅ **Tablas creadas**: Verificar en phpMyAdmin
3. ✅ **Dependencias instaladas**: `pip list | grep -E "(mysql|pymysql)"`

## 📞 Soporte

Si tienes problemas:
1. Verifica que MySQL/MariaDB esté ejecutándose
2. Confirma que la base de datos `ahorra_oink` existe
3. Revisa las credenciales en `database_config.env`
4. Ejecuta `python create_tables.py` para verificar la conexión

---

**¡Tu base de datos está lista para usar! 🎉**
