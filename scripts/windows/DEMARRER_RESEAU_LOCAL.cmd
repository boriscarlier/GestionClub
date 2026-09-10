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
echo Mode : reseau local controle
powershell -NoProfile -ExecutionPolicy Bypass -Command "$client=New-Object Net.Sockets.TcpClient;try{$client.Connect('127.0.0.1',8765);$client.Close();exit 0}catch{exit 1}" >nul 2>&1
if not errorlevel 1 (
  echo Un serveur Gestion Club est deja lance sur le port 8765.
  echo Fermez-le avant de changer entre mode local et mode reseau local.
  start "" "http://127.0.0.1:8765/"
  pause
  exit /b 0
)
echo Le serveur affichera les adresses IPv4 LAN autorisees.
echo N'ouvrez pas et ne redirigez pas le port 8765 sur le routeur.
py -3 server\lan_server.py start --data "%FCLC_DATA_PATH%"
pause
