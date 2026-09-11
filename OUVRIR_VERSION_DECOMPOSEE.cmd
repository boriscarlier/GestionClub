@echo off
chcp 65001 >nul
powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8765/ -TimeoutSec 3 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  echo Demarrez d'abord DEMARRER_SERVEUR.cmd puis connectez-vous sur la page d'accueil.
  pause
  exit /b 1
)
start "" "http://127.0.0.1:8765/gestion-modulaire"
