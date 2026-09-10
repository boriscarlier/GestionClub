@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
if not defined FCLC_DATA_DIR set "FCLC_DATA_DIR=%CD%\data"
if not exist "%FCLC_DATA_DIR%" mkdir "%FCLC_DATA_DIR%"
set "FCLC_DATA_PATH=%FCLC_DATA_DIR%\club.sqlite3"
py -3 --version >nul 2>&1
if errorlevel 1 (
  echo Python 3 est requis. Verifiez votre installation et le lanceur py.
  pause
  exit /b 1
)
set "PYTHONPATH=%CD%\server;%CD%\vendor"
echo Dossier programme : %CD%
echo Base conservee : %FCLC_DATA_PATH%
py -3 server\server.py start --data "%FCLC_DATA_PATH%"
pause
