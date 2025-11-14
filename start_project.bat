@echo off
echo ========================================
echo    AHORRA OINK - FULL STACK PROJECT
echo ========================================
echo.

echo Verificando XAMPP...
echo - Apache: http://localhost (puerto 80)
echo - MySQL: puerto 3306
echo - phpMyAdmin: http://localhost/phpmyadmin
echo.

echo Iniciando proyecto...
echo - Backend Django: http://localhost:8000
echo - Frontend React: http://localhost:5173
echo.

echo Presiona cualquier tecla para continuar...
pause >nul

echo.
echo Activando entorno virtual...
call venv\Scripts\activate.bat

echo.
echo Iniciando servidores...
python start_all.py

echo.
echo Proyecto detenido.
pause
