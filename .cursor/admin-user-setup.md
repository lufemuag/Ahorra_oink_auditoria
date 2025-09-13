# Usuario Administrador por Defecto - Ahorra Oink

## Configuración Implementada

Se ha implementado un usuario administrador por defecto que se crea automáticamente cuando la aplicación se inicia por primera vez.

### Credenciales del Administrador
- **Username**: `admin`
- **Password**: `abretecesamo`
- **Rol**: `admin`

### Características del Usuario Admin

#### Datos Personales
- **ID**: `admin-001`
- **Nombre**: Administrador Sistema
- **Apellido**: Sistema
- **Fecha de Creación**: Se establece automáticamente al inicializar

#### Configuración por Defecto
- **Notificaciones**: Habilitadas
- **Moneda**: USD
- **Tema**: Claro

#### Estadísticas Iniciales
- **Total Ahorros**: 0
- **Total Ingresos**: 0
- **Total Gastos**: 0
- **Racha**: 0

### Funcionalidades de Administrador

#### Funciones Disponibles
1. **`authService.isAdmin()`**: Verifica si el usuario actual es administrador
2. **`authService.getAllUsers()`**: Obtiene lista de todos los usuarios (solo admins)
3. **`authService.initializeDefaultAdmin()`**: Crea el usuario admin si no existe

#### Contexto de Autenticación
- **`isAdmin()`**: Función disponible en AuthContext para verificar rol
- **`getAllUsers()`**: Función para obtener todos los usuarios (solo admins)

### Implementación Técnica

#### Archivos Modificados
1. **`frontend/src/services/authService.js`**
   - Agregada función `initializeDefaultAdmin()`
   - Agregado campo `role` al modelo de usuario
   - Agregadas funciones `isAdmin()` y `getAllUsers()`
   - Constante `USERS_KEY` para consistencia

2. **`frontend/src/context/AuthContext.jsx`**
   - Inicialización automática del admin al cargar la app
   - Funciones `isAdmin()` y `getAllUsers()` expuestas en el contexto

#### Inicialización Automática
El usuario administrador se crea automáticamente cuando:
- La aplicación se inicia por primera vez
- No existe un usuario con username "admin" en localStorage
- Se ejecuta `authService.initializeDefaultAdmin()`

### Uso en la Aplicación

#### Verificar si es Admin
```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { isAdmin, user } = useAuth();
  
  if (isAdmin()) {
    return <AdminPanel />;
  }
  
  return <UserPanel />;
};
```

#### Obtener Lista de Usuarios
```javascript
import { useAuth } from '../context/AuthContext';

const AdminUsersList = () => {
  const { getAllUsers } = useAuth();
  
  const handleGetUsers = async () => {
    const result = await getAllUsers();
    if (result.success) {
      console.log('Usuarios:', result.users);
    }
  };
  
  return (
    <button onClick={handleGetUsers}>
      Ver Usuarios
    </button>
  );
};
```

### Seguridad

#### Consideraciones
- Las contraseñas se almacenan en texto plano (localStorage)
- Solo usuarios con rol "admin" pueden acceder a funciones administrativas
- Las contraseñas se ocultan en las respuestas de `getAllUsers()`

#### Recomendaciones para Producción
- Implementar hash de contraseñas
- Agregar validación de permisos en componentes
- Considerar autenticación de dos factores para admins

### Testing

Para probar el usuario administrador:
1. Iniciar la aplicación
2. Ir a la página de login
3. Usar credenciales: `admin` / `abretecesamo`
4. Verificar que el usuario tiene rol "admin"
5. Probar funciones administrativas

### Notas de Desarrollo

- El usuario admin se crea solo si no existe
- Compatible con la estructura existente de localStorage
- Mantiene consistencia con el modelo de datos establecido
- No afecta usuarios existentes

