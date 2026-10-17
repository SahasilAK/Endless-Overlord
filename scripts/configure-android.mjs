import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const android = path.join(root, 'android');
const manifest = path.join(android, 'app', 'src', 'main', 'AndroidManifest.xml');
if (!fs.existsSync(manifest)) {
  console.error('Missing native Android project. Run "npx cap add android" first.');
  process.exit(1);
}

let xml = fs.readFileSync(manifest, 'utf8');
let foundActivity = false;
xml = xml.replace(/<activity\b[^>]*>/g, (tag) => {
  if (foundActivity || !/MainActivity/.test(tag)) return tag;
  foundActivity = true;
  // Landscape including reverse landscape, locks orientation for action controls.
  if (/android:screenOrientation\s*=/.test(tag)) {
    tag = tag.replace(/android:screenOrientation\s*=\s*"[^"]*"/, 'android:screenOrientation="sensorLandscape"');
  } else {
    tag = tag.replace(/>$/, '\n            android:screenOrientation="sensorLandscape">');
  }
  return tag;
});
if (!foundActivity) {
  throw new Error('MainActivity not found in AndroidManifest.xml. Capacitor Android template may have changed.');
}
xml = xml.replace(/<application\b[^>]*>/, (tag) => {
  if (!/android:largeHeap=/.test(tag)) tag = tag.replace(/>$/, '\n        android:largeHeap="true">');
  return tag;
});
fs.writeFileSync(manifest, xml);

const dest = path.join(android, 'app', 'src', 'main', 'java',
  'com', 'eternaloverlord', 'game', 'MainActivity.java');
fs.mkdirSync(path.dirname(dest), {recursive: true});
fs.writeFileSync(dest, `package com.eternaloverlord.game;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

/** Immersive fullscreen, landscape game host. */
public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    hideSystemBars();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) hideSystemBars();
  }

  private void hideSystemBars() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      WindowInsetsController controller = getWindow().getInsetsController();
      if (controller != null) {
        controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
        controller.setSystemBarsBehavior(
            WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
      }
    } else {
      getWindow().getDecorView().setSystemUiVisibility(
          View.SYSTEM_UI_FLAG_FULLSCREEN |
          View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
          View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
          View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
          View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
          View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }
  }
}
`);

const srcIcons = path.join(root, 'mobile-assets');
const res = path.join(android, 'app', 'src', 'main', 'res');
for (const density of ['mdpi','hdpi','xhdpi','xxhdpi','xxxhdpi']) {
  const d = path.join(res, 'mipmap-' + density);
  fs.mkdirSync(d, {recursive: true});
  for (const file of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) {
    const src = path.join(srcIcons, 'mipmap-' + density, file);
    fs.copyFileSync(src, path.join(d, file));
  }
}
console.log('Android configured: landscape, fullscreen, keep-awake, icon.');
