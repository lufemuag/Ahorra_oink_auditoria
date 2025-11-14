@echo off
title AHORRA OINK - Full Stack Project
color 0A

echo.
echo ========================================
echo    🐷 AHORRA OINK - FULL STACK 🐷
echo ========================================
echo.
echo Verificando servicios...
echo.

echo ✅ XAMPP Control Panel v3.3.0
echo    - Apache: http://localhost (puerto 80)
echo    - MySQL: puerto 3306
echo    - phpMyAdmin: http://localhost/phpmyadmin
echo.

echo ✅ Node.js v22.19.0
echo ✅ npm v10.9.3
echo.

echo 🚀 Iniciando proyecto...
echo.

echo 📍 URLs disponibles:
echo    - Frontend: http://localhost:5173
echo    - Backend: http://localhost:8000
echo    - API: http://localhost:8000/api/
echo    - Admin: http://localhost:8000/admin/
echo.

echo Presiona cualquier tecla para continuar...
pause >nul

echo.
echo 🔧 Activando entorno virtual...
call venv\Scripts\activate.bat

echo.
echo 🚀 Iniciando servidores...
echo.
echo 💡 Para detener: Presiona Ctrl+C en cada ventana
echo.

start "Backend Django" cmd /k "python start_backend_safe.py"
timeout /t 3 /nobreak >nul
start "Frontend React" cmd /k "python start_frontend_safe.py"

echo.
echo ✅ Servidores iniciados en ventanas separadas
echo.
echo 🌐 Abre tu navegador en: http://localhost:5173
echo.
pause
