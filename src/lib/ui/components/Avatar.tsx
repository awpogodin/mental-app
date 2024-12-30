import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { OuterSpacingProps } from "../theme/propTypes";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { Surface } from "../layouts/Surface";
import { createThemedStyles } from "../theme/createThemedStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../hooks/useTheme";

type Props = {
  /**
   *  Имя для отображения инициалов
   */
  name?: string | null;
  /**
   *  Изображение аватара
   */
  source?: React.ComponentProps<typeof Image>["source"] | null;
  /**
   *  Текст, для отображения вместо аватара
   */
  text?: string;
  /**
   * Размер аватара
   * @default m
   */
  size?: "xs" | "s" | "m" | "l";
  /**
   * Функция для исполнения при нажатии
   */
  onPress?: () => void;
} & OuterSpacingProps;

const getInitials = (fullName: string): string => {
  const nameParts = fullName.split(" ").slice(0, 2);

  const initials = nameParts.map((part) => part.charAt(0).toUpperCase());
  return initials.join("");
};

const generateColorFromFullname = (fullName: string, alpha = 1): string => {
  let hash = 0;
  for (let i = 0; i < fullName.length; i++) {
    hash = (hash << 5) - hash + fullName.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }

  const r = Math.abs(hash % 256); // Red component
  const g = Math.abs((hash >> 8) % 256); // Green component
  const b = Math.abs((hash >> 16) % 256); // Blue component

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const Avatar: React.FC<Props> = ({
  name,
  source,
  text,
  size = "m",
  onPress,
  ...rest
}) => {
  const { colors, iconSizes } = useTheme();
  const [pressed, setPressed] = useState(false);
  const [imageSize, setImageSize] = useState(0);
  const style = useThemedStyles(styles);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleLayoutChange = (event: LayoutChangeEvent) => {
    const layoutHeight = event.nativeEvent.layout.height;
    setImageSize(layoutHeight);
  };

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    if (isMounted.current) {
      setPressed(false);
    }
  };

  const avatarStyle = StyleSheet.flatten([
    style.avatar,
    size === "xs" && style.avatarXS,
    size === "s" && style.avatarS,
    size === "m" && style.avatarM,
    size === "l" && style.avatarL,

    !!name &&
      !source && {
        backgroundColor: generateColorFromFullname(name, 0.5),
      },

    pressed && style.avatarPressed,
  ]);

  const textStyle = StyleSheet.flatten([
    style.text,
    size === "xs" && style.textXS,
    size === "s" && style.textS,
    size === "m" && style.textM,
    size === "l" && style.textL,
  ]);

  const iconSize = {
    xs: iconSizes.xs,
    s: iconSizes.s,
    m: iconSizes.m,
    l: iconSizes.l,
  };

  const renderContent = () => {
    if (text) {
      return <Text style={textStyle}>{text}</Text>;
    }
    if (!!source) {
      return (
        <Image
          style={{
            width: imageSize,
            height: imageSize,
          }}
          source={source}
        />
      );
    }
    if (name) {
      return <Text style={textStyle}>{getInitials(name)}</Text>;
    }
    return (
      <Ionicons
        name="person-outline"
        color={colors.iconSecondary}
        size={iconSize[size]}
      />
    );
  };

  return (
    <Surface {...rest}>
      <Pressable
        style={avatarStyle}
        disabled={!onPress}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Surface
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
          onLayout={handleLayoutChange}
        >
          {renderContent()}
        </Surface>
      </Pressable>
    </Surface>
  );
};

const styles = createThemedStyles((theme) => ({
  text: {
    color: theme.colors.textDefault,
    align: "center",
    ...theme.typography.default,
  },
  textXS: {
    ...theme.typography.caption2,
    fontSize: 8,
    lineHeight: 12,
  },
  textS: {
    ...theme.typography.caption2,
  },
  textM: {
    ...theme.typography.default,
  },
  textL: {
    ...theme.typography.largeTitle,
  },
  avatar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSecondary,
    overflow: "hidden",
  },
  avatarXS: {
    width: 16,
    height: 16,
    borderRadius: 16,
  },
  avatarS: {
    width: theme.sizes.controlSmall,
    height: theme.sizes.controlSmall,
    borderRadius: theme.sizes.controlSmall,
  },
  avatarM: {
    width: theme.sizes.controlDefault,
    height: theme.sizes.controlDefault,
    borderRadius: theme.sizes.controlDefault,
  },
  avatarL: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },

  avatarPressed: {
    opacity: 0.5,
  },
}));
