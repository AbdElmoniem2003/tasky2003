import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';
import { StatusBar } from '@capacitor/status-bar';

const config: CapacitorConfig = {
  appId: 'com.tasky2003.example',
  appName: 'Tasky',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body,
      resizeOnFullScreen: true,

    },
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: 'FIT_XY'
    }, StatusBar: {
      // "overlaysWebView": true,
      style: 'DEFAULT',
    }
  },
};

export default config;
