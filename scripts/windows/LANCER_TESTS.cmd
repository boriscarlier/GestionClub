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
py -3 scripts\run_tests_compact.py
if errorlevel 1 (
  echo ECHEC : conservez le bilan affiche.
  pause
  exit /b 1
)
echo Tests termines avec succes.
pause
