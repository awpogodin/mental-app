import { ApolloProvider } from "@apollo/client";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import "@/lib/i18n";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ThemeProvider } from "@/lib/ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { apolloClient } from "@/lib/gql";
import { useAppInit } from "@/hooks/useAppInit";
import { useColorScheme } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isLoaded = useAppInit();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <GestureHandlerRootView>
        <ThemeProvider themeKey={colorScheme === "dark" ? "dark" : "default"}>
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShadowVisible: false, title: "" }} initialRouteName="(app)">
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen
                name="onboarding"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth"
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}
