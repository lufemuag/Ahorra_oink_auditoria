# Modales del Dashboard - Ahorra Oink

## Funcionalidades Implementadas

### 1. Modal de Agregar Ingreso (`AddIncomeModal.jsx`)
- **Propósito**: Permitir al usuario registrar nuevos ingresos
- **Campos**:
  - Monto (obligatorio)
  - Categoría (obligatorio)
  - Descripción (obligatorio)
  - Fecha (opcional, por defecto hoy)
- **Categorías disponibles**:
  - Salario, Freelance, Inversiones, Ventas, Bonificaciones, Otros ingresos
- **Validaciones**:
  - Monto debe ser mayor a 0
  - Todos los campos obligatorios deben estar completos
  - Formato de fecha válido

### 2. Modal de Agregar Gasto (`AddExpenseModal.jsx`)
- **Propósito**: Permitir al usuario registrar nuevos gastos
- **Campos**:
  - Monto (obligatorio)
  - Categoría (obligatorio)
  - Descripción (obligatorio)
  - Fecha (opcional, por defecto hoy)
- **Categorías disponibles**:
  - Alimentación, Transporte, Vivienda, Entretenimiento, Salud, Educación, Ropa, Servicios, Otros gastos
- **Validaciones**:
  - Monto debe ser mayor a 0
  - Todos los campos obligatorios deben estar completos
  - Formato de fecha válido

### 3. Modal de Nueva Meta (`AddGoalModal.jsx`)
- **Propósito**: Permitir al usuario crear nuevas metas de ahorro
- **Campos**:
  - Título (obligatorio)
  - Categoría (obligatorio)
  - Monto objetivo (obligatorio)
  - Monto actual (opcional, por defecto 0)
  - Fecha límite (obligatorio)
  - Método de ahorro (opcional)
  - Descripción (opcional)
- **Categorías disponibles**:
  - Emergencia, Vacaciones, Casa, Auto, Educación, Retiro, Hobbie, Otros
- **Métodos de ahorro**:
  - Monto fijo mensual
  - Porcentaje de ingresos
  - Redondeo de gastos
  - Personalizado
- **Validaciones**:
  - Fecha límite debe ser futura
  - Monto objetivo debe ser mayor a 0
  - Todos los campos obligatorios deben estar completos

## Servicios Implementados

### TransactionService (`transactionService.js`)
- **Funciones principales**:
  - `create()`: Crear nueva transacción
  - `getByUser()`: Obtener transacciones del usuario
  - `getByType()`: Obtener transacciones por tipo
  - `getUserStats()`: Obtener estadísticas del usuario
  - `delete()`: Eliminar transacción
  - `getCategories()`: Obtener categorías disponibles

### Características del Servicio
- **Almacenamiento**: localStorage con clave `ahorra_oink_transactions`
- **Actualización automática**: Las estadísticas del usuario se actualizan automáticamente
- **Validación**: Manejo de errores y validaciones de datos
- **Compatibilidad**: Mantiene compatibilidad con el modelo de datos existente

## Integración con Dashboard

### Estado del Dashboard
- **Estadísticas dinámicas**: Se actualizan automáticamente al agregar transacciones
- **Transacciones recientes**: Muestra las últimas 4 transacciones
- **Consejos personalizados**: Cambian según el estado de ahorro del usuario

### Funcionalidades de los Botones
- **Agregar Saldo**: Abre modal de ingresos
- **Gastos**: Abre modal de gastos
- **Nueva Meta**: Abre modal de metas de ahorro

## Componente Modal Base

### Modal Reutilizable (`Modal.jsx`)
- **Características**:
  - Backdrop con click para cerrar
  - Botón de cerrar
  - Tamaños configurables (small, medium, large, full)
  - Animaciones suaves
  - Responsive design

### Estilos CSS
- **Modal.css**: Estilos base del modal
- **AddIncomeModal.css**: Estilos específicos para ingresos
- **AddExpenseModal.css**: Estilos específicos para gastos
- **AddGoalModal.css**: Estilos específicos para metas

## Flujo de Datos

### 1. Usuario hace clic en botón de acción
### 2. Se abre el modal correspondiente
### 3. Usuario completa el formulario
### 4. Se valida la información
### 5. Se guarda en localStorage
### 6. Se actualizan las estadísticas del usuario
### 7. Se cierra el modal
### 8. Se actualiza el Dashboard

## Validaciones Implementadas

### Validaciones de Formulario
- **Campos obligatorios**: Verificación de campos requeridos
- **Tipos de datos**: Validación de números y fechas
- **Rangos**: Montos positivos, fechas futuras
- **Formato**: Validación de formato de fechas

### Validaciones de Negocio
- **Fecha límite**: Debe ser futura para metas
- **Monto**: Debe ser positivo
- **Usuario**: Debe estar autenticado

## Manejo de Errores

### Tipos de Errores
- **Errores de validación**: Mostrados en el modal
- **Errores de sistema**: Logged en consola
- **Errores de red**: Manejo de errores de localStorage

### Experiencia de Usuario
- **Mensajes claros**: Errores descriptivos
- **Estados de carga**: Indicadores de progreso
- **Feedback visual**: Colores y iconos apropiados

## Responsive Design

### Breakpoints
- **Desktop**: Layout completo con grid
- **Tablet**: Ajustes de espaciado
- **Mobile**: Layout de una columna

### Adaptaciones Móviles
- **Formularios**: Campos apilados verticalmente
- **Botones**: Ancho completo en móviles
- **Modales**: Ajustes de padding y tamaño

## Próximas Mejoras

### Funcionalidades Adicionales
- **Edición de transacciones**: Modificar transacciones existentes
- **Categorías personalizadas**: Permitir crear categorías propias
- **Importación de datos**: Cargar datos desde archivos
- **Exportación**: Descargar reportes

### Mejoras de UX
- **Autocompletado**: Sugerencias basadas en historial
- **Atajos de teclado**: Navegación con teclado
- **Drag & Drop**: Arrastrar archivos para importar
- **Notificaciones**: Alertas de metas cumplidas

## Testing

### Casos de Prueba
- **Formularios vacíos**: Validación de campos obligatorios
- **Datos inválidos**: Manejo de errores
- **Flujo completo**: Desde botón hasta actualización
- **Responsive**: Funcionamiento en diferentes dispositivos

### Datos de Prueba
- **Usuario admin**: Credenciales admin/abretecesamo
- **Transacciones de ejemplo**: Datos para testing
- **Metas de prueba**: Objetivos de ahorro de ejemplo

