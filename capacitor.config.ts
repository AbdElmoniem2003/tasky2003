import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.tasky2003.example',
  appName: 'Tasky',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Ionic
    },
    "SplashScreen": {
      "launchAutoHide": false,
    }, "StatusBar": {
      "overlaysWebView": true,
      "style": 'Dark',
    }
  },
};

export default config;
