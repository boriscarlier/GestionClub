@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
if not defined GESTION_CLUB_DATA_DIR set "GESTION_CLUB_DATA_DIR=%CD%\data"
if not exist "%GESTION_CLUB_DATA_DIR%" mkdir "%GESTION_CLUB_DATA_DIR%"
set "GESTION_CLUB_DATA_PATH=%GESTION_CLUB_DATA_DIR%\club.sqlite3"
if not exist "%CD%\logs" mkdir "%CD%\logs"
py -3 --version >nul 2>&1
if errorlevel 1 (
  >"%CD%\logs\dernier_reseau_local.log" echo ERREUR : Python 3 est requis. Verifiez votre installation et le lanceur py.
  echo Python 3 est requis. Verifiez votre installation et le lanceur py.
  pause
  exit /b 1
)
set "PYTHONPATH=%CD%\server;%CD%\vendor"
echo Dossier programme : %CD%
echo Base conservee : %GESTION_CLUB_DATA_PATH%
echo Mode : passerelle reseau local V1.25.11.1
for /f %%I in ('py -3 -c "import network_access; h=network_access.discover_lan_hosts(); print(h[0] if h else '')"') do set "LAN_IP=%%I"
if defined LAN_IP (
  echo Adresse LAN detectee : http://%LAN_IP%:8766/
) else (
  echo Aucune adresse LAN detectee avant demarrage. Le diagnostic complet sera ecrit dans logs\dernier_reseau_local.log.
)
powershell -NoProfile -ExecutionPolicy Bypass -Command "$client=New-Object Net.Sockets.TcpClient;try{$client.Connect('127.0.0.1',8766);$client.Close();exit 0}catch{exit 1}" >nul 2>&1
if not errorlevel 1 (
  echo La passerelle LAN est deja lancee sur le port 8766.
  if defined LAN_IP start "" "http://%LAN_IP%:8766/"
  exit /b 0
)
echo Le serveur local 127.0.0.1:8765 doit rester en ligne.
echo N'ouvrez pas et ne redirigez pas le port 8766 sur le routeur.
py -3 server\lan_server.py --backend-port 8765 --port 8766 --log-dir "%CD%\logs"
set "LAN_RC=%ERRORLEVEL%"
if not "%LAN_RC%"=="0" (
  echo ECHEC du mode reseau local. Consultez "%CD%\logs\dernier_reseau_local.log".
)
pause
exit /b %LAN_RC%
