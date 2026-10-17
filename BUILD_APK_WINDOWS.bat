@echo off
setlocal
cd /d "%~dp0"
echo.
echo =========================================
echo   ETERNAL OVERLORD - Android APK Builder
echo =========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 22+ is required. Install Node.js LTS.
  goto :failed
)

if not defined ANDROID_HOME if exist "%LOCALAPPDATA%\Android\Sdk" set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
if not defined JAVA_HOME if exist "%ProgramFiles%\Android\Android Studio\jbr\bin\java.exe" set "JAVA_HOME=%ProgramFiles%\Android\Android Studio\jbr"

echo [1/5] Installing JavaScript dependencies...
call npm install
if errorlevel 1 goto :failed

echo [2/5] Building offline game...
call npm run build
if errorlevel 1 goto :failed

if not exist "android\gradlew.bat" (
  echo [3/5] Creating Android project...
  call npx cap add android
  if errorlevel 1 goto :failed
) else (
  echo [3/5] Android project already exists.
)

echo [4/5] Syncing and configuring Android...
call npx cap sync android
if errorlevel 1 goto :failed
call npm run android:configure
if errorlevel 1 goto :failed

echo [5/5] Compiling the APK with Gradle...
call node scripts\build-apk.mjs
if errorlevel 1 goto :failed

echo.
echo SUCCESS! Your APK is here:
echo %~dp0EternalOverlord-debug.apk
echo.
pause
exit /b 0

:failed
echo.
echo BUILD FAILED. Read README.md and check Android Studio SDK / Java / Node.
echo.
pause
exit /b 1
