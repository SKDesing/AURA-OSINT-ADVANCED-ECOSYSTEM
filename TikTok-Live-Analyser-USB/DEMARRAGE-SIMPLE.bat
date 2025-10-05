@echo off
chcp 65001 >nul
title SCIS - Démarrage Automatique

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎯 SCIS DASHBOARD                         ║
echo ║           Système de Cartographie d'Influence Sociale       ║
echo ║                  Démarrage Automatique                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Vérification des prérequis
echo [INFO] Vérification des prérequis...

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js non trouvé
    echo.
    echo Veuillez installer Node.js depuis: https://nodejs.org
    echo Téléchargez la version LTS recommandée
    pause
    exit /b 1
)

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Python non trouvé
    echo.
    echo Veuillez installer Python depuis: https://python.org
    echo Cochez "Add to PATH" lors de l'installation
    pause
    exit /b 1
)

echo [OK] Prérequis vérifiés

:: Création des répertoires
echo [INFO] Création des répertoires...
if not exist "evidence" mkdir evidence
if not exist "evidence\uploads" mkdir evidence\uploads
if not exist "evidence\videos" mkdir evidence\videos
if not exist "evidence\screenshots" mkdir evidence\screenshots
if not exist "logs" mkdir logs
if not exist "logs\system" mkdir logs\system
if not exist "temp" mkdir temp

:: Installation des dépendances
echo [INFO] Installation des dépendances...
cd backend
if not exist "node_modules" (
    echo Installation des modules backend...
    npm install --silent --no-audit
)
cd ..

cd services
if not exist "node_modules" (
    echo Installation des modules services...
    npm install --silent --no-audit
)
cd ..

:: Initialisation de la base de données
echo [INFO] Initialisation de la base de données...
cd backend
node init-database.js >nul 2>&1
cd ..

:: Démarrage des services
echo [INFO] Démarrage des services...

:: Frontend
cd frontend-build
start /B python -m http.server 9000 >nul 2>&1
cd ..

:: Services backend
cd services
start /B node service-launcher.js >nul 2>&1
cd ..

:: Attendre le démarrage
echo [INFO] Initialisation des services (10 secondes)...
timeout /t 10 /nobreak >nul

:: Tests de connectivité
echo [INFO] Vérification des services...

curl -s http://localhost:9000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Interface utilisateur: http://localhost:9000
) else (
    echo [ERREUR] Interface utilisateur inaccessible
)

:: Ouvrir le navigateur
echo [INFO] Ouverture de l'interface...
start http://localhost:9000

:: Créer raccourci bureau
echo [INFO] Création du raccourci bureau...
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%USERPROFILE%\Desktop\SCIS Dashboard.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "http://localhost:9000" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "SCIS Dashboard - Interface Forensique" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"
cscript "%TEMP%\CreateShortcut.vbs" >nul 2>&1
del "%TEMP%\CreateShortcut.vbs" >nul 2>&1

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✅ DÉMARRAGE TERMINÉ                      ║
echo ║                                                              ║
echo ║  Interface SCIS: http://localhost:9000                       ║
echo ║                                                              ║
echo ║  📋 GUIDE RAPIDE:                                            ║
echo ║  • Utilisez le menu latéral pour naviguer                   ║
echo ║  • Créez des profils dans 'Profils'                         ║
echo ║  • Surveillez les lives dans 'Live Monitor'                 ║
echo ║  • Explorez les données dans 'Base de Données'              ║
echo ║                                                              ║
echo ║  💡 CONSEILS:                                                ║
echo ║  • Mode jour/nuit avec le bouton en bas                     ║
echo ║  • Données stockées localement et sécurisées                ║
echo ║  • Preuves automatiquement hashées (SHA-256)                ║
echo ║                                                              ║
echo ║  ⚠️  NE FERMEZ PAS CETTE FENÊTRE                            ║
echo ║     (Elle maintient les services actifs)                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Garder la fenêtre ouverte
echo Appuyez sur Ctrl+C pour arrêter les services
pause >nul