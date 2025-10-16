@echo off
title CodeKiosk Quick Deploy

echo ==================================================
echo    CodeKiosk - Quick Deployment
echo ==================================================
echo.

echo Select deployment option:
echo 1. Standard Deployment (npm)
echo 2. Docker Deployment
echo.

set /p deploy_choice="Enter your choice (1-2): "

if "%deploy_choice%"=="1" goto STANDARD_DEPLOY
if "%deploy_choice%"=="2" goto DOCKER_DEPLOY

echo Invalid choice. Defaulting to standard deployment.
goto STANDARD_DEPLOY

:STANDARD_DEPLOY
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
goto END

:DOCKER_DEPLOY
echo.
echo Building Docker image...
docker build -t codekiosk .
if %errorlevel% neq 0 (
    echo Error: Failed to build Docker image.
    pause
    exit /b 1
)

echo.
echo Running application in Docker...
echo.
echo Application will be available at: http://localhost:3000
echo Admin panel: http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the container
echo.
docker run -p 3000:3000 codekiosk
goto END

:END