import React, { ReactNode } from 'react';
import { ColorKeys } from '../theme/types';
import { OuterSpacingProps } from '../theme/propTypes';
import { useTheme } from '../hooks/useTheme';
import { Surface } from '../layouts/Surface';
import { hexToRgba } from '../helpers/hexToRgba';
import { Text } from '../components/Text';

type Props = {
  /**
   * Содержимое бейджа
   */
  text: string;
  /**
   * Иконка бейджа
   */
  icon?: ReactNode;
  /**
   * Цвет текста бейджа
   * @default text
   */
  color?: ColorKeys
} & OuterSpacingProps;

export const Badge: React.FC<Props> = ({ text, icon, color = 'text', ...rest }) => {
  const { colors } = useTheme()

  return (
    <Surface p="xs" flexDirection='row' style={{
      // eslint-disable-next-line no-magic-numbers
      backgroundColor: hexToRgba(colors[color], 0.1),
    }} br="l" {...rest}>
      {icon}
      <Text type="footnote" ml={!!icon && 'xs'} color={color} text={text}/>
    </Surface>
  );
};
