@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
py -3 --version >nul 2>&1
if errorlevel 1 (
  echo Python 3 est requis. Verifiez votre installation et le lanceur py.
  pause
  exit /b 1
)
set PYTHONPATH=%CD%\server;%CD%\vendor
py -3 server\server.py start
pause
