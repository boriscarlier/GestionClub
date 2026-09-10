@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
py -3 --version >nul 2>&1
if errorlevel 1 (
  echo Python 3 est requis. Verifiez votre installation et le lanceur py.
  pause
  exit /b 1
)
set PYTHONPATH=%CD%\server;%CD%\vendor;%CD%\tests
py -3 -m unittest -v tests.test_server tests.test_watch tests.test_manual_watch tests.test_pdf_watch tests.test_convocations
if errorlevel 1 (
  echo ECHEC : conservez le bilan affiche.
  pause
  exit /b 1
)
echo Tests termines avec succes.
pause
