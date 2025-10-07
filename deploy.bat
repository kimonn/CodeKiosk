@echo off
title CodeKiosk Deployment Script

echo ==================================================
echo    CodeKiosk - Digital Signage System
echo    Deployment and Installation Script
echo ==================================================
echo.

:MENU
echo Please select an option:
echo 1. Full Installation and Deployment
echo 2. Install Dependencies Only
echo 3. Build Application Only
echo 4. Start Application Only
echo 5. Install, Build and Start (Complete Setup)
echo 6. Exit
echo.

set /p choice=Enter your choice (1-6): 

if "%choice%"=="1" goto FULL_DEPLOY
if "%choice%"=="2" goto INSTALL_DEPS
if "%choice%"=="3" goto BUILD_APP
if "%choice%"=="4" goto START_APP
if "%choice%"=="5" goto COMPLETE_SETUP
if "%choice%"=="6" goto EXIT_SCRIPT

echo Invalid choice. Please try again.
echo.
goto MENU

:FULL_DEPLOY
echo.
echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    goto MENU
)

echo.
echo [2/3] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build application.
    pause
    goto MENU
)

echo.
echo [3/3] Starting application...
echo Application will start on http://localhost:3000
echo Admin panel will be available at http://localhost:3000/admin
echo Press Ctrl+C to stop the server
echo.
call npm start
goto MENU

:INSTALL_DEPS
echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
) else (
    echo Dependencies installed successfully.
)
pause
goto MENU

:BUILD_APP
echo.
echo Building application...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build application.
) else (
    echo Application built successfully.
)
pause
goto MENU

:START_APP
echo.
echo Starting application...
echo Application will start on http://localhost:3000
echo Admin panel will be available at http://localhost:3000/admin
echo Press Ctrl+C to stop the server
echo.
call npm start
goto MENU

:COMPLETE_SETUP
echo.
echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    goto MENU
)

echo.
echo [2/3] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build application.
    pause
    goto MENU
)

echo.
echo [3/3] Starting application...
echo Application will start on http://localhost:3000
echo Admin panel will be available at http://localhost:3000/admin
echo Press Ctrl+C to stop the server
echo.
call npm start
goto MENU

:EXIT_SCRIPT
echo.
echo Thank you for using CodeKiosk!
echo.
pause
exit /b 0