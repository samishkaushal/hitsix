@echo off
title HITSIX Backend
cd /d "%~dp0backend"
echo.
echo ==========================================
echo HITSIX BACKEND
echo ==========================================
echo.
if not exist node_modules (
  echo Installing backend packages...
  call npm install
)
echo.
echo Starting backend on http://localhost:5000
echo Keep this window open while using the website.
echo.
call npm start
pause
