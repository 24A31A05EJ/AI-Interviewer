@echo off
REM Quick startup script for AI Interview Platform

echo.
echo ============================================
echo AI Interview Prep - Quick Start
echo ============================================
echo.

REM Check if Node is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install from https://nodejs.org/
    exit /b 1
)

echo Node.js found: 
node -v

REM Install server
echo.
echo [1/4] Installing backend...
cd server
if exist node_modules (
    echo Backend dependencies already installed
) else (
    call npm install
)

REM Create .env if not exists
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit server\.env with your MongoDB connection string
    echo Example: MONGO_URI=mongodb://localhost:27017/ai_interview_platform
    pause
)

REM Install client
echo.
echo [2/4] Installing frontend...
cd ..\client
if exist node_modules (
    echo Frontend dependencies already installed
) else (
    call npm install
)

echo.
echo [3/4] Setup complete!
echo.
echo To run the project:
echo.
echo Terminal 1 (Backend):
echo   cd server
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd client
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
echo Demo credentials:
echo   Email: demo@example.com
echo   Password: password
echo.
pause
