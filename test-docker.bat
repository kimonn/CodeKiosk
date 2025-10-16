@echo off
title CodeKiosk Docker Test

echo ==================================================
echo    CodeKiosk - Docker Deployment Test
echo ==================================================
echo.

echo Checking for Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not in PATH.
    echo Please install Docker Desktop and try again.
    echo Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
) else (
    echo Docker is installed.
    docker --version
)

echo.
echo Building Docker image...
docker build -t codekiosk .
if %errorlevel% neq 0 (
    echo Error: Failed to build Docker image.
    pause
    exit /b 1
)

echo.
echo Running Docker container...
echo.
echo The application will be available at: http://localhost:3000
echo Admin panel: http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the container
echo.
docker run -p 3000:3000 codekiosk