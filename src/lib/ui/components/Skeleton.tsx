import React, { ReactNode, useEffect, useMemo } from "react";

import { StyleSheet } from "react-native";
import {
  BorderRadiusProps,
  FlexboxProps,
  InnerSpacingProps,
  OuterSpacingProps,
  PositionProps,
} from "../theme/propTypes";
import { useTheme } from "../hooks/useTheme";
import { getStyleSpacings } from "../helpers/getStyleSpacings";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { createThemedStyles } from "../theme/createThemedStyles";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { getStyleRadius } from "../helpers/getStyleRadius";

const zero = 0;
const half = 2;

const numberOfReps = -1;

const SkeletonContext = React.createContext<SharedValue<number> | null>(null);
const defaultOpacity = 1;
const targetOpacity = 0.3;

type SkeletonBlockProps = {
  /**
   * Скругление скелетона
   */
  rounded?: boolean;
} & OuterSpacingProps &
  InnerSpacingProps &
  PositionProps &
  Pick<FlexboxProps, 'flex'> &
  BorderRadiusProps;

const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  p,
  ph,
  pv,
  pt,
  pr,
  pb,
  pl,
  m,
  mh,
  mv,
  mt,
  mr,
  mb,
  ml,
  br,
  brTop,
  brRight,
  brBottom,
  brLeft,
  rounded,
  ...rest
}) => {
  const { spacings, radii } = useTheme();
  const themedStyles = useThemedStyles(styles);

  const sharedOpacity = React.useContext(SkeletonContext);

  const { width, height } = rest;

  useEffect(() => {
    if (!rounded) {
      return;
    }
    if (typeof width === "string" || typeof height === "string") {
      console.warn(
        "Skeleton: rounded prop is not supported with string width/height values"
      );
    }
    if (width !== height) {
      console.warn(
        "Skeleton: rounded prop is not supported with different width/height values"
      );
    }
  }, [height, rounded, width]);

  const maxSize = useMemo(() => {
    if (typeof width === "string" || typeof height === "string") {
      return null;
    }
    if (width !== height) {
      return null;
    }
    return width ?? zero;
  }, [height, width]);

  const margins = getStyleSpacings({
    base: m,
    horizontal: mh,
    vertical: mv,
    top: mt,
    right: mr,
    bottom: mb,
    left: ml,
    type: "margin",
    spacings,
  });

  const paddings = getStyleSpacings({
    base: p,
    horizontal: ph,
    vertical: pv,
    top: pt,
    right: pr,
    bottom: pb,
    left: pl,
    type: "padding",
    spacings,
  });

  const radius = getStyleRadius({
    br,
    brTop,
    brRight,
    brBottom,
    brLeft,
    radii,
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: sharedOpacity?.value ?? defaultOpacity,
    };
  });

  const surfaceStyle = StyleSheet.flatten([
    rest,
    radius,
    themedStyles.skeleton,
    margins,
    paddings,
    rounded &&
      !!maxSize && {
        borderRadius: Math.ceil(maxSize / half),
      },
  ]);

  return <Animated.View style={[surfaceStyle, animatedStyle]} />;
};

const styles = createThemedStyles((theme) => ({
  skeleton: {
    backgroundColor: theme.colors.skeleton,
  },
}));

type Props = {
  /**
   * Скелето
   */
  children: ReactNode;
};

export const Skeleton = ({ children }: Props) => {
  const opacity = useSharedValue(defaultOpacity);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(targetOpacity, {
        duration: 500,
        easing: Easing.linear,
      }),
      numberOfReps,
      true
    );
  }, [opacity]);

  return (
    <SkeletonContext.Provider value={opacity}>
      {children}
    </SkeletonContext.Provider>
  );
};

Skeleton.Block = SkeletonBlock;
