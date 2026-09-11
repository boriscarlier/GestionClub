@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
if not defined GESTION_CLUB_DATA_DIR set "GESTION_CLUB_DATA_DIR=%CD%\data"
if not exist "%GESTION_CLUB_DATA_DIR%" mkdir "%GESTION_CLUB_DATA_DIR%"
set "GESTION_CLUB_DATA_PATH=%GESTION_CLUB_DATA_DIR%\club.sqlite3"
py -3 --version >nul 2>&1
if errorlevel 1 (
  if not exist "%CD%\logs" mkdir "%CD%\logs"
  >"%CD%\logs\dernier_serveur.log" echo ERREUR : Python 3 est requis. Verifiez votre installation et le lanceur py.
  echo Python 3 est requis. Verifiez votre installation et le lanceur py.
  pause
  exit /b 1
)
set "PYTHONPATH=%CD%\server;%CD%\vendor"
echo Dossier programme : %CD%
echo Base conservee : %GESTION_CLUB_DATA_PATH%
echo Version runtime : V1.25.11.1
powershell -NoProfile -ExecutionPolicy Bypass -Command "$client=New-Object Net.Sockets.TcpClient;try{$client.Connect('127.0.0.1',8765);$client.Close();exit 0}catch{exit 1}" >nul 2>&1
if not errorlevel 1 (
  echo Un serveur Gestion Club semble deja lance sur http://127.0.0.1:8765/
  start "" "http://127.0.0.1:8765/"
  exit /b 0
)
py -3 server\current_server.py start --data "%GESTION_CLUB_DATA_PATH%"
set "SERVER_RC=%ERRORLEVEL%"
if not "%SERVER_RC%"=="0" (
  if not exist "%CD%\logs" mkdir "%CD%\logs"
  >"%CD%\logs\dernier_serveur.log" echo ERREUR : le serveur V1.25.11.1 s'est arrete avec le code %SERVER_RC%.
)
pause
exit /b %SERVER_RC%
