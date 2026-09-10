@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
if not exist "%CD%\logs" mkdir "%CD%\logs"
py -3 --version >nul 2>&1
if errorlevel 1 (
  >"%CD%\logs\dernier_test.log" echo ERREUR : Python 3 est requis. Verifiez votre installation et le lanceur py.
  echo Python 3 est requis. Verifiez votre installation et le lanceur py.
  pause
  exit /b 1
)
set "PYTHONPATH=%CD%\server;%CD%\vendor;%CD%\tests"
echo Tests techniques avec bases temporaires. Votre dossier data n'est pas modifie.
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "STAMP=%%I"
set "TEST_LOG=%CD%\logs\tests_%STAMP%.log"
set "LAST_LOG=%CD%\logs\dernier_test.log"
set "ERR_LOG=%CD%\logs\erreur_tests_%STAMP%.log"
py -3 scripts\run_tests_compact.py --log "%TEST_LOG%"
set "TEST_RC=%ERRORLEVEL%"
if exist "%TEST_LOG%" copy /Y "%TEST_LOG%" "%LAST_LOG%" >nul
if not "%TEST_RC%"=="0" (
  if not exist "%TEST_LOG%" >"%TEST_LOG%" echo ECHEC LANCEUR TESTS - code %TEST_RC%
  copy /Y "%TEST_LOG%" "%ERR_LOG%" >nul
  copy /Y "%TEST_LOG%" "%LAST_LOG%" >nul
  echo ECHEC : logs conserves dans "%LAST_LOG%" et "%ERR_LOG%".
  pause
  exit /b %TEST_RC%
)
echo Tests termines avec succes.
echo Log : "%LAST_LOG%"
pause
exit /b 0
