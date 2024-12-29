import React from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "../hooks/useSafeAreaInsets";
import { useTheme } from "../hooks/useTheme";
import { Surface } from "../layouts/Surface";
import { Text } from "./Text";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Header - элемент для отображения заголовка экрана
 */
export const Header = ({
  back,
  options: { title, headerLeft, headerRight, headerTitle: customTitle },
  navigation,
}: NativeStackHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { spacings, colors, iconSizes } = useTheme();

  const headerTitle = title || "";

  const headerLeftProps = {
    canGoBack: Boolean(navigation?.goBack),
    tintColor: colors.iconDefault,
  };

  return (
    <Surface
      flexDirection="row"
      alignItems="center"
      p="md"
      style={{ paddingTop: spacings.md + insets.top }}
    >
      {!!headerLeft && <Surface mr="xs">{headerLeft(headerLeftProps)}</Surface>}
      {!!back && !headerLeft && (
        <Pressable hitSlop={20} onPress={navigation.goBack}>
          {({ pressed }) => (
            <Ionicons
              name="chevron-back-outline"
              color={colors.iconDefault}
              size={iconSizes.m}
              style={{ opacity: pressed ? 0.5 : 1, marginRight: spacings.xs }}
            />
          )}
        </Pressable>
      )}

      <Surface flex={1}>
        {typeof customTitle === "function" ? (
          customTitle({ children: headerTitle })
        ) : (
          <Text align="center" text={headerTitle} type="labelLarge" />
        )}
      </Surface>

      {!!headerRight && (
        <Surface ml="xs">
          {headerRight({
            tintColor: colors.iconDefault,
            canGoBack: false,
          })}
        </Surface>
      )}
    </Surface>
  );
};
