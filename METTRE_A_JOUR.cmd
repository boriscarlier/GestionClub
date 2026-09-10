@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set "SOURCE=%CD%"
set "TARGET=%~1"
if "%TARGET%"=="" (
  set "TARGET=D:\FC_LA_COUR_GestionClub"
)
if "%TARGET%"=="" (
  echo Mise a jour annulee : aucun dossier cible.
  pause
  exit /b 1
)
for %%I in ("%SOURCE%") do set "SOURCE_FULL=%%~fI"
for %%I in ("%TARGET%") do set "TARGET_FULL=%%~fI"
if /I "%SOURCE_FULL%"=="%TARGET_FULL%" (
  echo La source et la cible sont identiques. Aucune mise a jour necessaire.
  pause
  exit /b 0
)
if not exist "%TARGET%" mkdir "%TARGET%"
echo Source programme : %SOURCE_FULL%
echo Dossier stable   : %TARGET_FULL%
echo Le dossier data de la cible est conserve.
if not exist "%SOURCE_FULL%\logs" mkdir "%SOURCE_FULL%\logs"
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "STAMP=%%I"
set "UPDATE_LOG=%SOURCE_FULL%\logs\erreur_mise_a_jour_%STAMP%.log"
robocopy "%SOURCE_FULL%" "%TARGET_FULL%" /E /XD ".git" "data" "releases" "__pycache__" "logs" /XF "*.sqlite3" "*.db" "*.log" "*.pyc" /TEE /LOG:"%UPDATE_LOG%"
set "ROBO_RC=%ERRORLEVEL%"
if %ROBO_RC% GEQ 8 (
  echo Echec de la mise a jour. Log : "%UPDATE_LOG%"
  pause
  exit /b %ROBO_RC%
)
if exist "%UPDATE_LOG%" del /Q "%UPDATE_LOG%"
echo Mise a jour terminee.
echo Lancement des tests depuis "%TARGET_FULL%".
call "%TARGET_FULL%\LANCER_TESTS.cmd"
if errorlevel 1 (
  echo Tests en echec. Le serveur n'est pas demarre automatiquement.
  pause
  exit /b 1
)
echo Tests valides. Demarrage du serveur.
call "%TARGET_FULL%\DEMARRER_SERVEUR.cmd"
pause