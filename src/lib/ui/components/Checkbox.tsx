import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable } from "react-native";
import { OuterSpacingProps } from "../theme/propTypes";
import { useTheme } from "../hooks/useTheme";
import { Surface } from "../layouts/Surface";

type Props = {
  selected?: boolean;
  onPress?: () => void;
} & OuterSpacingProps;

export const Checkbox: React.FC<Props> = ({ selected, onPress, ...rest }) => {
  const { sizes, colors, iconSizes } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={20}>
      {({ pressed }) => (
        <Surface
          br="m"
          bg={selected ? 'surfacePrimary' : 'surfaceSecondary'}
          width={sizes.controlSmall}
          height={sizes.controlSmall}
          justifyContent="center"
          alignItems="center"
          style={{ opacity: pressed ? 0.5 : 1 }}
          {...rest}
        >
          {!!selected && <Ionicons name="checkmark-sharp" color={colors.iconPrimary} size={iconSizes.s} />}
        </Surface>
      )}
    </Pressable>
  );
};
