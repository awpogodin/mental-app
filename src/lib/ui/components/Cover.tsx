import React, { useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
} from "react-native";
import { Image } from 'expo-image'
import { OuterSpacingProps } from "../theme/propTypes";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { Surface } from "../layouts/Surface";
import { createThemedStyles } from "../theme/createThemedStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../hooks/useTheme";

type Props = {
  /**
   *  Изображения обложки
   */
  source?: React.ComponentProps<typeof Image>["source"] | null;
  /**
   * Размер обложки
   */
  size?: "m" | "l" | number;
  /**
   * Функция для исполнения при нажатии
   */
  onPress?: () => void;
} & OuterSpacingProps;


export const Cover: React.FC<Props> = ({
  source,
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
    style.cover,
    size === "m" && style.coverM,
    size === "l" && style.coverL,
    typeof size === 'number' && { width: size, height: size},

    pressed && style.coverPressed,
  ]);

  const renderContent = () => {
    if (source) {
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
    return (
      <Ionicons
        name="calendar-clear-outline"
        color={colors.iconSecondary}
        size={iconSizes.l}
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
  cover: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSecondary,
    overflow: "hidden",
    borderRadius: theme.radii.l,
  },
  coverM: {
    width: theme.sizes.controlDefault,
    height: theme.sizes.controlDefault,
  },
  coverL: {
    width: 100,
    height: 100,
  },

  coverPressed: {
    opacity: 0.5,
  },
}));
