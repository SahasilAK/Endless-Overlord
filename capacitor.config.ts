import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eternaloverlord.game',
  appName: 'Eternal Overlord',
  webDir: 'dist',
  // No remote URL. Game code, art, and sound ship inside the APK.
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
