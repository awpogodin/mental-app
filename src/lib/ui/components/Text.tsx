import React from 'react';
import {
  Text as NativeText,
  TextProps as RNTextProps,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ColorKeys, TypographyKeys } from '../theme/types';
import { Surface } from '../layouts/Surface';
import { FlexboxProps, OuterSpacingProps } from '../theme/propTypes';

export type Props = Pick<FlexboxProps, 'flex'> & {
  /**
   * Текст
   */
  text: string;
  /**
   * Внешний вид текста
   * @default default
   */
  type?: TypographyKeys;
  /**
   * Выравнивание текста относительно контейнера
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Цвет текста
   * @default textDefault
   */
  color?: ColorKeys;
  /**
   * Усечение текста
   */
  ellipsize?: boolean;
} & Pick<RNTextProps, 'numberOfLines' | 'onPress' | 'style'> &
  OuterSpacingProps;

export const Text: React.FC<Props> = ({
  text,
  type = 'default',
  align,
  color = 'textDefault',
  ellipsize,
  numberOfLines,
  style,
  onPress,
  ...rest
}) => {
  const { colors, typography } = useTheme();

  const textStyle = StyleSheet.flatten([
    {
      color: colors[color],
      ...typography[type],
    },
    align && { textAlign: align },
    style,
  ]);

  return (
    <Surface {...rest}>
      <NativeText style={textStyle} {...((ellipsize || !!numberOfLines) && { numberOfLines: numberOfLines || 1 })}>
        {text}
      </NativeText>
    </Surface>
  );
};
