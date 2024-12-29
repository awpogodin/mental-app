import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false, title: "" }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="oneTimeCode"
      />
      <Stack.Screen
        name="form"
      />
    </Stack>
  );
}
