@echo off
echo ===================================================
echo   Starte Igor (Backend ^& Frontend) im Dev-Modus...
echo ===================================================

:: 1. Starte Angular Frontend in einem neuen, separaten CMD-Fenster
echo [Frontend] Starte Angular...
start "Igor Frontend (Angular)" cmd /k "cd Frontend && npx pnpm start"

:: 2. Starte Spring Boot Backend im aktuellen CMD-Fenster
echo [Backend] Starte Spring Boot mit Docker Compose support...
cd Backend
call gradlew.bat bootRun
