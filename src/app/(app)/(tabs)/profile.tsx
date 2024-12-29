import { userFeature } from "@/features/user";
import { useAuth } from "@/lib/auth";
import { Surface, useTheme } from "@/lib/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Pressable } from "react-native";

export default function Screen() {
  const navigation = useNavigation();
  const router = useRouter();

  const { colors, iconSizes } = useTheme();

  const { currentUser } = useAuth();

  const handleSettings = useCallback(() => {
    router.navigate("/settings");
  }, [router]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Surface mr="md">
          <Pressable onPress={handleSettings} hitSlop={12}>
            {({ pressed }) => (
              <Ionicons
                name="settings-outline"
                color={colors.iconDefault}
                size={iconSizes.m}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Surface>
      ),
    });
  }, [colors.iconDefault, handleSettings, iconSizes.m, navigation]);

  if (!currentUser?.id) {
    return null;
  }

  return <userFeature.components.Details id={currentUser.id} />;
}
