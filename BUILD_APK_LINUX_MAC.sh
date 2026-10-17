#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "Installing dependencies..."
npm install
echo "Bundling offline game..."
npm run build
if [ ! -f android/gradlew ]; then
  npx cap add android
fi
npx cap sync android
node scripts/configure-android.mjs
node scripts/build-apk.mjs
echo "Installable debug APK: EternalOverlord-debug.apk"
