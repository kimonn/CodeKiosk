@echo off
title CodeKiosk Quick Deploy

echo ==================================================
echo    CodeKiosk - Quick Deployment
echo ==================================================
echo.

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Building application...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build application.
    pause
    exit /b 1
)

echo.
echo Starting application...
echo.
echo Application will be available at: http://localhost:3000
echo Admin panel: http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the server
echo.
call npm start