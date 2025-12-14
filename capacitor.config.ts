import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'lostfoundapp',
  webDir: 'www',
  // @ts-ignore
  plugins: {
    Keyboard: {
      resize: 'none',
    },
  },
};

export default config;
