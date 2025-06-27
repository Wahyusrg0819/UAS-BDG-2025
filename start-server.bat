@echo off
echo 🚀 Starting Neo4j Recipe Visualization Development Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies.
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
    echo.
)

REM Start the development server
echo 🌐 Starting HTTP server on http://localhost:8080
echo 📂 Serving files from current directory
echo 🔄 Server will auto-reload on file changes
echo.
echo Press Ctrl+C to stop the server
echo Opening browser in 3 seconds...
echo.

timeout /t 3 /nobreak >nul
start http://localhost:8080

npx http-server -p 8080 -c-1 -o

pause
