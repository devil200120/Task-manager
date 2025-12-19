@echo off
echo ================================================
echo  Task Manager - Setup Script
echo ================================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js: OK
echo.

echo [2/5] Installing backend dependencies...
cd backend
if not exist ".env" (
    echo Creating backend .env file...
    copy .env.example .env
)
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)
cd ..
echo Backend dependencies: OK
echo.

echo [3/5] Installing frontend dependencies...
cd frontend
if not exist ".env" (
    echo Creating frontend .env file...
    copy .env.example .env
)
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies: OK
echo.

echo [4/5] Checking MongoDB...
echo NOTE: Make sure MongoDB is running on localhost:27017
echo Or update MONGODB_URI in backend/.env
echo.

echo [5/5] Setup Complete!
echo.
echo ================================================
echo  Next Steps:
echo ================================================
echo.
echo 1. Update backend/.env with your MongoDB URI
echo 2. Start backend:  cd backend ^&^& npm run dev
echo 3. Start frontend: cd frontend ^&^& npm run dev
echo.
echo OR use Docker:
echo   docker-compose up -d
echo.
echo ================================================
pause
