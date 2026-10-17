import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const android = path.join(root, 'android');
const wrapper = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
if (!fs.existsSync(path.join(android, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew'))) {
  console.error('Missing Gradle wrapper. Initialize first: npx cap add android');
  process.exit(1);
}
console.log('Building Android debug APK...');
const result = spawnSync(wrapper, ['assembleDebug', '--no-daemon'], {
  cwd: android,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});
if (result.status !== 0) {
  console.error('Android Gradle build failed. Check Android Studio SDK installation.');
  process.exit(result.status ?? 1);
}
const from = path.join(android, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
if (!fs.existsSync(from)) {
  console.error('Build finished but debug APK was not found at:', from);
  process.exit(1);
}
const to = path.join(root, 'EternalOverlord-debug.apk');
fs.copyFileSync(from, to);
console.log('SUCCESS: ' + to);
