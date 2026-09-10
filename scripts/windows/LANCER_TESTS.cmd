@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
py -3 --version >nul 2>&1
if errorlevel 1 (
  echo Python 3 est requis. Verifiez votre installation et le lanceur py.
  pause
  exit /b 1
)
set "PYTHONPATH=%CD%\server;%CD%\vendor;%CD%\tests"
echo Tests techniques avec bases temporaires. Votre dossier data n'est pas modifie.
if not exist "%CD%\logs" mkdir "%CD%\logs"
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "STAMP=%%I"
set "TMP_LOG=%TEMP%\FCLC_tests_%RANDOM%_%RANDOM%.log"
set "ERR_LOG=%CD%\logs\erreur_tests_%STAMP%.log"
powershell -NoProfile -ExecutionPolicy Bypass -Command "& py -3 scripts\run_tests_compact.py 2^>^&1 ^| Tee-Object -FilePath '%TMP_LOG%'; exit $LASTEXITCODE"
set "TEST_RC=%ERRORLEVEL%"
if not "%TEST_RC%"=="0" (
  move /Y "%TMP_LOG%" "%ERR_LOG%" >nul
  echo ECHEC : log conserve dans "%ERR_LOG%".
  pause
  exit /b %TEST_RC%
)
if exist "%TMP_LOG%" del /Q "%TMP_LOG%"
echo Tests termines avec succes.
pause