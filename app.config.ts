import { type ExpoConfig } from "@expo/config-types";

const config: ExpoConfig = {
  name: "mental-app",
  slug: "mental-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#9e3dfb",
    dark: {
      backgroundColor: "#9e3dfb",
    },
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.pogodin.a.mental-app",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#000000",
    },
    package: "com.pogodin.a.mentalapp",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    [
      "expo-dev-launcher",
      {
        launchMode: "most-recent",
      },
    ],
    ["expo-build-properties", {
      android: {
        minSdkVersion: 26,
      },
      ios: {
        deploymentTarget: "13.4",
      },
    }],
    "expo-localization",
    "expo-secure-store",
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
