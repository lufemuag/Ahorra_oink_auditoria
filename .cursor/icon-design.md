# Diseño de Iconos - Ahorra Oink

## Iconos Creados

### 1. Favicon Principal (`favicon.svg`)
- **Tamaño**: 32x32px
- **Uso**: Favicon del navegador
- **Diseño**: Cerdito simplificado con alcancía
- **Colores**: 
  - Fondo: #3B8048 (Verde Principal)
  - Cerdito: #FED16A (Amarillo Principal)
  - Detalles: #0C1A0E (Verde Oscuro)

### 2. Icono de Aplicación (`ahorra-oink-icon.svg`)
- **Tamaño**: 64x64px
- **Uso**: Apple Touch Icon, iconos de aplicación
- **Diseño**: Cerdito detallado con alcancía y monedas
- **Colores**: Misma paleta que el favicon

## Elementos del Diseño

### Cerdito
- **Cuerpo**: Forma ovalada en amarillo (#FED16A)
- **Cabeza**: Círculo con ojos, nariz y orejas
- **Hocico**: Forma ovalada en amarillo claro (#FFF4A4)
- **Patas**: Pequeñas formas ovaladas
- **Cola**: Línea curva simple

### Alcancía
- **Cuerpo**: Rectángulo redondeado en verde oscuro (#0C1A0E)
- **Ranura**: Rectángulo para insertar monedas
- **Monedas**: Círculos amarillos representando dinero
- **Símbolo**: "$" en amarillo

### Paleta de Colores Utilizada
- **Verde Principal**: #3B8048 (fondo del icono)
- **Verde Oscuro**: #0C1A0E (alcancía, nariz, ojos)
- **Amarillo Principal**: #FED16A (cuerpo del cerdito, monedas)
- **Amarillo Claro**: #FFF4A4 (hocico del cerdito)

## Archivos de Configuración

### HTML (`index.html`)
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/ahorra-oink-icon.svg" />
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#3B8048" />
```

### Manifest (`manifest.json`)
- Configuración PWA completa
- Iconos para diferentes tamaños
- Metadatos de la aplicación
- Tema de color consistente

## Características Técnicas

### SVG Optimizado
- **Vectores**: Escalable sin pérdida de calidad
- **Tamaño**: Archivos pequeños y eficientes
- **Compatibilidad**: Soporte universal en navegadores modernos
- **Accesibilidad**: Colores con buen contraste

### Responsive Design
- **Favicon**: 32x32px para navegadores
- **Apple Touch**: 64x64px para dispositivos iOS
- **PWA**: Múltiples tamaños para diferentes usos

## Uso en la Aplicación

### Navegador
- El favicon aparece en la pestaña del navegador
- Se muestra en marcadores/favoritos
- Aparece en historial de navegación

### Dispositivos Móviles
- Icono en pantalla de inicio (iOS)
- Icono en launcher (Android)
- Icono en notificaciones

### PWA (Progressive Web App)
- Icono cuando se instala como app
- Icono en la barra de tareas
- Icono en el menú de aplicaciones

## Mantenimiento

### Actualizaciones
- Los SVGs se pueden editar fácilmente
- Cambios de color se aplican automáticamente
- Fácil escalado para nuevos tamaños

### Consistencia
- Mantener la paleta de colores establecida
- Preservar la identidad visual del cerdito
- Asegurar legibilidad en todos los tamaños

## Notas de Diseño

### Filosofía
- **Simplicidad**: Diseño limpio y reconocible
- **Identidad**: Cerdito como mascota de la marca
- **Funcionalidad**: Alcancía representa el ahorro
- **Color**: Paleta establecida del proyecto

### Inspiración
- Cerdito tradicional de alcancía
- Colores verdes (dinero, crecimiento)
- Amarillo (optimismo, ahorro)
- Diseño amigable y accesible

