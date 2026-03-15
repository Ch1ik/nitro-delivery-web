@echo off
setlocal enabledelayedexpansion

echo 🚀 Nitro Delivery Platform Deployment Script
echo ==========================================

:menu
echo.
echo What would you like to deploy?
echo 1) Backend only (Railway)
echo 2) Frontend only (Vercel)
echo 3) Both (Backend + Frontend)
echo 4) Exit
echo.
set /p choice=
if "%choice%"=="" set choice=3

if "%choice%"=="1" goto deploy_backend
if "%choice%"=="2" goto deploy_frontend
if "%choice%"=="3" goto deploy_both
if "%choice%"=="4" goto end

:deploy_backend
echo [INFO] Deploying backend to Railway...
call :check_prerequisites

:: Deploy to Railway
echo [INFO] Building and deploying to Railway...
railway up
if %errorlevel% neq 0 (
    echo [ERROR] Backend deployment failed
    goto end
)
echo [SUCCESS] Backend deployed to Railway ✓
goto health_check

:deploy_frontend
echo [INFO] Deploying frontend to Vercel...
call :check_prerequisites

:: Build frontend
echo [INFO] Building frontend...
npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed
    goto end
)

:: Deploy to Vercel
echo [INFO] Deploying to Vercel...
vercel --prod
if %errorlevel% neq 0 (
    echo [ERROR] Frontend deployment failed
    goto end
)
echo [SUCCESS] Frontend deployed to Vercel ✓
goto end

:deploy_both
echo [INFO] Deploying both backend and frontend...
call :deploy_backend
call :deploy_frontend
goto health_check

:check_prerequisites
echo [INFO] Checking prerequisites...

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+
    goto end
)

:: Check git
git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git repository not initialized. Please run 'git init'
    goto end
)

:: Install Vercel CLI if not present
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Vercel CLI not found. Installing...
    npm install -g vercel
)

:: Install Railway CLI if not present
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Railway CLI not found. Installing...
    npm install -g @railway/cli
)

echo [SUCCESS] Prerequisites check passed ✓
goto :eof

:health_check
echo [INFO] Running health checks...
echo [INFO] Waiting for deployment to settle...
timeout /t 30 >nul

:: Check backend health
echo [INFO] Checking backend health...
curl -f -s --max-time 30 "https://your-project.railway.app/health" >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Backend health check passed ✓
) else (
    echo [WARNING] Backend health check failed. Please check Railway logs.
)
goto :end

:end
echo.
echo [SUCCESS] Deployment completed! 🎉
echo.
echo Next steps:
echo 1. Configure environment variables in Railway and Vercel dashboards
echo 2. Update your Google Maps API key if needed
echo 3. Test the deployed applications
echo 4. Check logs for any issues
echo.
echo Useful links:
echo - Railway Dashboard: https://railway.app
echo - Vercel Dashboard: https://vercel.com
echo - Documentation: ./DEPLOYMENT.md
echo.
pause
