import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import "@/lib/i18n";
import { useAuth } from "@/lib/auth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
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
    </Stack>
  );
}
