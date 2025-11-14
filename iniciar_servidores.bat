@echo off
echo ========================================
echo    INICIANDO SERVIDORES AHORRA OINK
echo ========================================
echo.

echo Iniciando Backend Django...
start "Backend Django" cmd /k "cd /d %~dp0 && python backend/manage.py runserver 127.0.0.1:8000"

echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo Iniciando Frontend Vite...
start "Frontend Vite" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo    SERVIDORES INICIADOS
echo ========================================
echo.
echo Backend Django: http://127.0.0.1:8000
echo Frontend Vite:  http://localhost:5173
echo.
echo Credenciales de prueba:
echo   Email: test@test.com
echo   Password: Test123456
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul




