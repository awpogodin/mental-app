import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack screenOptions={{ headerShadowVisible: false, title: "" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
      <Stack.Screen
        name="entry-form"
        options={{ headerShown: false, presentation: "modal", title: '' }}
      />
      <Stack.Screen
        name="settings"
        options={{ headerShown: false, presentation: "modal", title: '' }}
      />
      <Stack.Screen
        name="entries"
        options={{ title: t('entries.title') }}
      />
    </Stack>
  );
}
