import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "TalkingBear",
  slug: "TalkingBear",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "talkingbear",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.anonymous.TalkingBear",
    // ОБОВ'ЯЗКОВО для iOS:
    infoPlist: {
      NSMicrophoneUsageDescription: "Ведмедик має чути тебе, щоб повторювати твої слова."
    }
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png"
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS"
    ],
    package: "com.anonymous.TalkingBear"
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ],
      // Налаштування для аудіо
      [
        "expo-audio",
        {
          "microphonePermission": "Ведмедик має чути тебе, щоб повторювати твої слова."
        }
      ],
      "expo-asset"
    ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true
  }
});