import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ColorKeys } from "../theme/types";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { Surface } from "../layouts/Surface";
import { OuterSpacingProps } from "../theme/propTypes";
import { createThemedStyles } from "../theme/createThemedStyles";
import { LoaderSpinner } from "./LoaderSpinner";
import { useTheme } from "../hooks/useTheme";

type Props = {
  /**
   * Внешний вид кнопки
   * @default primary
   */
  type?: "primary" | "secondary" | 'negative';
  /**
   * Имя иконки
   */
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  /**
   * Функция для рендера кастомной иконки
   */
  renderIcon?: ({
    color,
    size,
  }: {
    color: string;
    size: number;
  }) => React.ReactNode;
  /**
   * Статус загрузки
   */
  loading?: boolean;
  /**
   * Статус активности. Меняет отрисовку состояния и блокирует вызовы onPress
   */
  disabled?: boolean;
  /**
   * Функция для исполнения при нажатии
   */
  onPress?: () => void;
} & OuterSpacingProps;

export const IconButton: React.FC<Props> = ({
  type = "primary",
  icon,
  renderIcon,
  loading,
  disabled,
  onPress,
  ...rest
}) => {
  const [pressed, setPressed] = useState(false);

  const { colors, iconSizes } = useTheme();

  const style = useThemedStyles(styles);

  const isMounted = useRef(false);

  useEffect(() => {
    if (!renderIcon && !icon) {
      console.error(
        `renderIcon or icon must be provided for IconButton component.`
      );
    }
  }, [icon, renderIcon]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    if (isMounted.current) {
      setPressed(false);
    }
  };

  const buttonStyle = StyleSheet.flatten([
    style.button,
    type === "primary" && style.buttonPrimary,

    type === "secondary" && style.buttonSecondary,

    type === "negative" && style.buttonNegative,

    pressed && style.buttonPressedOrDisabled,
    disabled && style.buttonPressedOrDisabled,
  ]);

  const color = useMemo((): ColorKeys => {
    if (type === "primary") {
      return "iconPrimary";
    }
    if (type === "negative") {
      return "iconError";
    }
    return "iconDefault";
  }, [type]);

  const renderButton = () => {
    if (loading) {
      return <LoaderSpinner size="m" color={color} />;
    }
    if (renderIcon) {
      return (
        <Surface>
          {renderIcon({ color: colors[color], size: iconSizes.s })}
        </Surface>
      );
    }
    return (
      <Surface>
        <Ionicons name={icon} color={colors[color]} size={iconSizes.s} />
      </Surface>
    );
  };

  return (
    <Surface {...rest}>
      <Pressable
        disabled={disabled || loading || !onPress}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={buttonStyle}
      >
        {renderButton()}
      </Pressable>
    </Surface>
  );
};

const styles = createThemedStyles((theme) => ({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: theme.sizes.controlDefault,
    width: theme.sizes.controlDefault,
    borderRadius: theme.radii.l,
    paddingVertical: theme.spacings.xxs,
    paddingHorizontal: theme.spacings.xxs,
  },

  buttonPrimary: {
    backgroundColor: theme.colors.surfacePrimary,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  buttonNegative: {
    backgroundColor: theme.colors.surfaceSecondary,
  },

  buttonPressedOrDisabled: {
    opacity: 0.5,
  },
}));
