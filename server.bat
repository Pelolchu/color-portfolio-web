@echo off
cd /d "C:\Users\ramir\Desktop\color-portfolio-web"

echo Iniciando servidor local...
echo.
echo Abre el navegador en: http://localhost:8000
echo Presiona Ctrl+C para detener el servidor
echo.

npx http-server -p 8000 -g
