@echo off
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 20 or newer first: https://nodejs.org
  pause
  exit /b 1
)
call npm install --no-audit --no-fund
if errorlevel 1 (
  pause
  exit /b 1
)
call npm start
pause
