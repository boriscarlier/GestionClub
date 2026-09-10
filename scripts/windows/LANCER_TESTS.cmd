@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
py -3 --version >nul 2>&1
if errorlevel 1 (
  if not exist "%CD%\logs" mkdir "%CD%\logs"
  >"%CD%\logs\erreur_python_absent.log" echo Python 3 est requis. Verifiez votre installation et le lanceur py.
  echo Python 3 est requis. Verifiez votre installation et le lanceur py.
  pause
  exit /b 1
)
set "PYTHONPATH=%CD%\server;%CD%\vendor;%CD%\tests"
echo Tests techniques avec bases temporaires. Votre dossier data n'est pas modifie.
if not exist "%CD%\logs" mkdir "%CD%\logs"
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "STAMP=%%I"
set "ERR_LOG=%CD%\logs\erreur_tests_%STAMP%.log"
py -3 scripts\run_tests_compact.py --log "%ERR_LOG%"
set "TEST_RC=%ERRORLEVEL%"
if not "%TEST_RC%"=="0" (
  if not exist "%ERR_LOG%" >"%ERR_LOG%" echo ECHEC LANCEUR TESTS - code %TEST_RC%
  echo ECHEC : log conserve dans "%ERR_LOG%".
  pause
  exit /b %TEST_RC%
)
if exist "%ERR_LOG%" del /Q "%ERR_LOG%"
echo Tests termines avec succes.
pause
