@echo off
title CodeKiosk Installation

echo ==================================================
echo    CodeKiosk - Installation Script
echo ==================================================
echo.

echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js 18.x or higher and try again.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo Node.js is installed.
    node --version
)

echo.
echo Checking for npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH.
    pause
    exit /b 1
) else (
    echo npm is installed.
    npm --version
)

echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Installation completed successfully!
echo.
echo To start the development server, run: npm run dev
echo To build for production, run: npm run build
echo To start the production server, run: npm start
echo.
pause