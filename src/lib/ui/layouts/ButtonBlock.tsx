import { useSafeAreaInsets } from "../hooks/useSafeAreaInsets";
import { useTheme } from "../hooks/useTheme";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { createThemedStyles } from "../theme/createThemedStyles";
import { ColorKeys } from "../theme/types";
import React, { ReactNode, useMemo } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import { Surface } from "./Surface";

const zero = 0;

type Props = {
  /**
   * Заливка
   */
  bg?: ColorKeys;
  /**
   * Тип для области применения
   * @default page
   */
  type?: "page" | "bottom-sheet";
  /**
   * Используется ли нижний safe отступ
   * @default true
   */
  useBottomSafeArea?: boolean;
  /**
   * Содержимое блока
   */
  children: ReactNode;
  /**
   * Функция, возвращающая высоту блока
   */
  onChangeHeight?: (height: number) => void;
};

export const ButtonBlock: React.FC<Props> = ({
  type = "page",
  bg,
  useBottomSafeArea = true,
  children,
  onChangeHeight,
}) => {
  const localStyle = useThemedStyles(styles);
  const { colors, spacings } = useTheme();
  const insets = useSafeAreaInsets();

  const onLayout = (event: LayoutChangeEvent) => {
    onChangeHeight?.(Math.floor(event.nativeEvent.layout.height));
  };

  const blockStyle = useMemo(
    () =>
      StyleSheet.flatten([
        type === "page" && {
          ...localStyle.padding,
          ...localStyle.pageContainer,
        },
        !!insets.bottom &&
          type === "page" && {
            paddingBottom:
              spacings.md + (useBottomSafeArea ? insets.bottom : zero),
          },
        !!bg && { backgroundColor: colors[bg] },
      ]),
    [localStyle.padding, localStyle.pageContainer, type, insets.bottom, spacings.md, useBottomSafeArea, bg, colors]
  );

  return (
    <Surface style={blockStyle} onLayout={onLayout}>
      {children}
    </Surface>
  );
};

const styles = createThemedStyles((theme) => ({
  padding: { paddingHorizontal: theme.spacings.md },
  pageContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: theme.spacings.xs,
    paddingBottom: theme.spacings.xl,
  },
}));
