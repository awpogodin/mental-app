import { getStyleGaps } from '../helpers/getStyleGaps';
import { getStyleRadius } from '../helpers/getStyleRadius';
import { getStyleSpacings } from '../helpers/getStyleSpacings';
import { useTheme } from '../hooks/useTheme';
import { BorderProps, FlexboxProps, InnerSpacingProps, OuterSpacingProps, PositionProps } from '../theme/propTypes';
import { ColorKeys } from '../theme/types';
import React from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

type Props = FlexboxProps &
  PositionProps &
  BorderProps &
  OuterSpacingProps &
  InnerSpacingProps & {
    /**
     * Заливка
     */
    bg?: ColorKeys;
    /**
     * Контент
     */
    children?: React.ReactNode;
    /**
     * Вызывается при "on mount" и на смену позиционирования
     *
     * { nativeEvent: { layout: { x, y, width, height } } }
     */
    onLayout?: (event: LayoutChangeEvent) => void
    /**
     * Стили
     */
    style?: StyleProp<ViewStyle>;
  } & Pick<ViewProps, 'pointerEvents'>;

export const Surface: React.FC<Props> = ({
  bg,
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
  borderColor,
  gap,
  rowGap,
  columnGap,
  children,
  style,
  pointerEvents,
  onLayout,
  ...rest
}) => {
  const { colors, spacings, radii } = useTheme();

  const margins = getStyleSpacings({
    base: m,
    horizontal: mh,
    vertical: mv,
    top: mt,
    right: mr,
    bottom: mb,
    left: ml,
    type: 'margin',
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
    type: 'padding',
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

  const gaps = getStyleGaps({
    gap: gap,
    rowGap: rowGap,
    columnGap: columnGap,
    spacings,
  });

  const surfaceStyle = StyleSheet.flatten([
    rest,
    margins,
    paddings,
    radius,
    gaps,
    !!bg && { backgroundColor: colors[bg] },
    !!borderColor && { borderColor: colors[borderColor] },
    style,
  ]);

  return (
    <View
      style={surfaceStyle}
      pointerEvents={pointerEvents}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
};
