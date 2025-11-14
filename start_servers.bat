@echo off
title AHORRA OINK - Servidores
color 0A

echo.
echo ========================================
echo    🐷 AHORRA OINK - SERVIDORES 🐷
echo ========================================
echo.

echo 🚀 Iniciando servidores...
echo.

echo 📍 URLs disponibles:
echo    - Frontend: http://localhost:5173
echo    - Backend: http://localhost:8000
echo    - API: http://localhost:8000/api/
echo    - Admin: http://localhost:8000/admin/
echo.

echo 💡 Para detener: Presiona Ctrl+C en cada ventana
echo.

start "Backend Django" cmd /k "cd backend && python manage.py runserver"
timeout /t 3 /nobreak >nul
start "Frontend React" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Servidores iniciados en ventanas separadas
echo.
echo 🌐 Abre tu navegador en: http://localhost:5173
echo.
pause

