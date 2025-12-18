import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.muure.positioner',
  appName: 'Muure Positioner',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
