@echo off
title TikTok Live Analyser - Demarrage
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎯 TIKTOK LIVE ANALYSER                   ║
echo ║                   Lancement depuis cle USB                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Verification des dependances...

:: Verifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js non trouve. Installation requise.
    echo Telechargez Node.js depuis: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js detecte
echo [INFO] Demarrage des services...

:: Demarrer le gestionnaire de processus
start /min cmd /c "node process-manager.js"
timeout /t 3 /nobreak >nul

:: Demarrer le frontend React
cd frontend-react
start /min cmd /c "npm start"
cd ..

:: Attendre que les services soient prets
echo [INFO] Initialisation des services (10 secondes)...
timeout /t 10 /nobreak >nul

:: Ouvrir Brave ou navigateur par defaut
echo [INFO] Ouverture de l'interface...
if exist "brave-portable\brave.exe" (
    start "" "brave-portable\brave.exe" --new-window "http://localhost:3000"
) else (
    start "" "http://localhost:3000"
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✅ APPLICATION DEMARREE                    ║
echo ║                                                              ║
echo ║  Interface: http://localhost:3000                            ║
echo ║  Fermez cette fenetre pour arreter l'application            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

pause