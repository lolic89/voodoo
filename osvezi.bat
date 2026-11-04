@echo off
rem Dupli klik: ubacuje meni i footer iz _delovi\ u sve strane
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0alati\osvezi.ps1"
echo.
pause
