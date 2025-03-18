
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f697982d0f7544c9ac234996ec96f499',
  appName: 'cyber-safeguard-suite',
  webDir: 'dist',
  server: {
    url: 'https://f697982d-0f75-44c9-ac23-4996ec96f499.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      releaseType: undefined
    }
  }
};

export default config;
