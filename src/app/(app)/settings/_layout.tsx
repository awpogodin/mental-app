import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import "react-native-reanimated";

export default function Layout() {
  const { t } = useTranslation();
  return (
    <Stack screenOptions={{ headerShadowVisible: false, title: t('settings.title') }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
