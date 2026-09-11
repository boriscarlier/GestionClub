@echo off
chcp 65001 >nul
setlocal EnableExtensions
cd /d "%~dp0"
set "SOURCE=%CD%"
set "TARGET=%~1"
if "%TARGET%"=="" (
  for /f "usebackq delims=" %%I in (`py -3 "%~dp0scripts\resolve_installation.py"`) do set "TARGET=%%I"
)
if "%TARGET%"=="" (
  echo Impossible de determiner le dossier cible. Verifier Python et les installations existantes.
  pause
  exit /b 2
)
for %%I in ("%SOURCE%") do set "SOURCE_FULL=%%~fI"
for %%I in ("%TARGET%") do set "TARGET_FULL=%%~fI"
if not exist "%TARGET_FULL%" mkdir "%TARGET_FULL%"
if not exist "%TARGET_FULL%\logs" mkdir "%TARGET_FULL%\logs"
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "STAMP=%%I"
set "UPDATE_LOG=%TARGET_FULL%\logs\mise_a_jour_%STAMP%.log"
set "LAST_UPDATE_LOG=%TARGET_FULL%\logs\derniere_mise_a_jour.log"
>"%UPDATE_LOG%" echo CLUB EXEMPLE Gestion Club - mise a jour %DATE% %TIME%
>>"%UPDATE_LOG%" echo Source : %SOURCE_FULL%
>>"%UPDATE_LOG%" echo Cible  : %TARGET_FULL%

set "SOURCE_VERSION=INCONNUE"
if exist "%SOURCE_FULL%\PROJECT_STATE.yaml" (
  for /f "tokens=2" %%V in ('findstr /B /C:"version:" "%SOURCE_FULL%\PROJECT_STATE.yaml"') do set "SOURCE_VERSION=%%V"
)
>>"%UPDATE_LOG%" echo Version source : %SOURCE_VERSION%
echo Source programme : %SOURCE_FULL%
echo Dossier stable   : %TARGET_FULL%
echo Version source   : %SOURCE_VERSION%
echo Le dossier data de la cible est conserve.

if /I "%SOURCE_FULL%"=="%TARGET_FULL%" (
  >>"%UPDATE_LOG%" echo AUCUNE COPIE : source et cible identiques.
  copy /Y "%UPDATE_LOG%" "%LAST_UPDATE_LOG%" >nul
  echo La source et la cible sont identiques. Aucune mise a jour effectuee.
  echo Log : "%LAST_UPDATE_LOG%"
  pause
  exit /b 0
)

py -3 --version >nul 2>&1
if errorlevel 1 (
  >>"%UPDATE_LOG%" echo ERREUR : Python 3 absent.
  copy /Y "%UPDATE_LOG%" "%LAST_UPDATE_LOG%" >nul
  echo Python 3 est requis. Log : "%LAST_UPDATE_LOG%"
  pause
  exit /b 1
)

>>"%UPDATE_LOG%" echo Arret controle des anciennes instances CLUB EXEMPLE...
py -3 "%SOURCE_FULL%\scripts\restart_local_server.py" 8766 >>"%UPDATE_LOG%" 2>&1
set "STOP_LAN_RC=%ERRORLEVEL%"
if %STOP_LAN_RC% GEQ 3 (
  copy /Y "%UPDATE_LOG%" "%LAST_UPDATE_LOG%" >nul
  echo Echec lors du controle du port LAN 8766. Log : "%LAST_UPDATE_LOG%"
  pause
  exit /b %STOP_LAN_RC%
)
py -3 "%SOURCE_FULL%\scripts\restart_local_server.py" 8765 >>"%UPDATE_LOG%" 2>&1
set "STOP_RC=%ERRORLEVEL%"
if %STOP_RC% GEQ 3 (
  copy /Y "%UPDATE_LOG%" "%LAST_UPDATE_LOG%" >nul
  echo Echec lors de l'arret controle du serveur. Log : "%LAST_UPDATE_LOG%"
  pause
  exit /b %STOP_RC%
)

robocopy "%SOURCE_FULL%" "%TARGET_FULL%" /E /XD ".git" "%SOURCE_FULL%\data" "%TARGET_FULL%\data" "releases" "__pycache__" "%SOURCE_FULL%\logs" "%TARGET_FULL%\logs" /XF "*.sqlite3" "*.db" "*.log" "*.pyc" /TEE /LOG+:"%UPDATE_LOG%"
set "ROBO_RC=%ERRORLEVEL%"
>>"%UPDATE_LOG%" echo Code Robocopy : %ROBO_RC%
if %ROBO_RC% GEQ 8 (
  >>"%UPDATE_LOG%" echo ERREUR : copie interrompue.
  copy /Y "%UPDATE_LOG%" "%LAST_UPDATE_LOG%" >nul
  echo Echec de la mise a jour. Log : "%LAST_UPDATE_LOG%"
  pause
  exit /b %ROBO_RC%
)

set "TARGET_VERSION=INCONNUE"
if exist "%TARGET_FULL%\PROJECT_STATE.yaml" (
  for /f "tokens=2" %%V in ('findstr /B /C:"version:" "%TARGET_FULL%\PROJECT_STATE.yaml"') do set "TARGET_VERSION=%%V"
)
echo Version cible    : %TARGET_VERSION%
>>"%UPDATE_LOG%" echo Version cible : %TARGET_VERSION%
if /I not "%SOURCE_VERSION%"=="%TARGET_VERSION%" (
  >>"%UPDATE_LOG%" echo ERREUR : version source et cible differentes.
  copy /Y "%UPDATE_LOG%" "%LAST_UPDATE_LOG%" >nul
  echo ECHEC : la version cible ne correspond pas a la source.
  echo Log : "%LAST_UPDATE_LOG%"
  pause
  exit /b 9
)

>>"%UPDATE_LOG%" echo Copie validee. Dossier data preserve.
copy /Y "%UPDATE_LOG%" "%LAST_UPDATE_LOG%" >nul
echo Mise a jour terminee et version cible verifiee.
echo Log mise a jour : "%LAST_UPDATE_LOG%"
echo Lancement des tests depuis "%TARGET_FULL%".
call "%TARGET_FULL%\LANCER_TESTS.cmd"
set "TEST_RC=%ERRORLEVEL%"
>>"%UPDATE_LOG%" echo Code tests : %TEST_RC%
copy /Y "%UPDATE_LOG%" "%LAST_UPDATE_LOG%" >nul
if not "%TEST_RC%"=="0" (
  echo Tests en echec. Le serveur n'est pas demarre automatiquement.
  echo Logs : "%LAST_UPDATE_LOG%" et "%TARGET_FULL%\logs\dernier_test.log"
  pause
  exit /b %TEST_RC%
)

>>"%UPDATE_LOG%" echo Tests valides. Demarrage du runtime %TARGET_VERSION%.
copy /Y "%UPDATE_LOG%" "%LAST_UPDATE_LOG%" >nul
echo Tests valides. Demarrage du serveur %TARGET_VERSION%.
call "%TARGET_FULL%\DEMARRER_SERVEUR.cmd"
exit /b %ERRORLEVEL%
