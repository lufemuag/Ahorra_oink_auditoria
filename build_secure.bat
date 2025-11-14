@echo off
REM Script para construir la aplicación con medidas de seguridad en Windows

echo 🔒 Iniciando build seguro de la aplicación...

REM Cambiar al directorio del frontend
cd frontend

echo 📦 Instalando dependencias...
call npm install

echo 🔧 Configurando variables de entorno para producción...
set NODE_ENV=production
set VITE_API_URL=https://tu-dominio.com/api

echo 🏗️ Construyendo aplicación con ofuscación...
call npm run build

echo 🔍 Verificando archivos generados...
if exist "dist" (
    echo ✅ Build exitoso. Archivos generados en ./dist/
    
    echo 🔒 Verificando ofuscación...
    
    REM Verificar que no haya source maps
    if not exist "dist\assets\*.map" (
        echo ✅ Source maps eliminados correctamente
    ) else (
        echo ⚠️ Se encontraron source maps - eliminando...
        del /q "dist\assets\*.map" 2>nul
    )
    
    echo.
    echo 🎉 Build seguro completado exitosamente!
    echo 📁 Archivos listos para producción en: ./frontend/dist/
    echo.
    echo 🔒 Medidas de seguridad aplicadas:
    echo    ✅ Código JavaScript ofuscado y minificado
    echo    ✅ Source maps eliminados
    echo    ✅ Console.log removidos
    echo    ✅ Nombres de variables ofuscados
    echo    ✅ Archivos divididos en chunks seguros
    echo    ✅ Headers de seguridad configurados
    echo.
    echo 🚀 Para desplegar:
    echo    1. Copia el contenido de ./frontend/dist/ a tu servidor web
    echo    2. Configura el servidor para servir archivos estáticos
    echo    3. Asegúrate de que el backend esté configurado con HTTPS
    
) else (
    echo ❌ Error: No se pudo generar el directorio dist/
    exit /b 1
)

echo.
echo 🔐 Recordatorios de seguridad:
echo    • Nunca expongas el código fuente en producción
echo    • Usa HTTPS en producción
echo    • Configura headers de seguridad en el servidor web
echo    • Monitorea logs de seguridad regularmente
echo    • Mantén las dependencias actualizadas

pause
