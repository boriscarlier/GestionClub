@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set "SOURCE=%CD%"
set "TARGET=%~1"
if "%TARGET%"=="" (
  set /p TARGET=Chemin du dossier Gestion Club a mettre a jour :
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
robocopy "%SOURCE_FULL%" "%TARGET_FULL%" /E /XD ".git" "data" "releases" "__pycache__" /XF "*.sqlite3" "*.db" "*.log" "*.pyc"
if %ERRORLEVEL% GEQ 8 (
  echo Echec de la mise a jour. Conservez ce message.
  pause
  exit /b 1
)
echo Mise a jour terminee. Lancez "%TARGET_FULL%\DEMARRER_SERVEUR.cmd".
pause
