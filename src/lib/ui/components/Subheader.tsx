import Ionicons from '@expo/vector-icons/Ionicons';
import React, { ReactNode } from 'react';
import { OuterSpacingProps } from '../theme/propTypes';
import { Surface } from '../layouts/Surface';
import { Text } from './Text';
import { useTheme } from '../hooks/useTheme';

type Props = {
  /**
   * Заголовок
   */
  title: string;
  /**
   * Иконка справа
   */
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  /**
   * Включение разделителя между заголовком и содержимым
   */
  withDivider?: boolean;
  /**
   * Содержимое
   */
  children: ReactNode;
} & OuterSpacingProps

export const Subheader: React.FC<Props> = ({ title, icon, withDivider, children, ...rest }) => {
  const { colors, iconSizes } = useTheme();
  return (
    <Surface {...rest}>
      <Surface flexDirection='row' justifyContent='space-between' alignItems="center">
        <Text text={title} type="labelLarge" color="textSecondary" />
        {!!icon && (
          <Ionicons
          name={icon}
          color={colors.textSecondary}
          size={iconSizes.s}
        />
        )}
      </Surface>
      {!!withDivider && (
        <Surface
        mt="xs"
        height={1}
        bg="surfaceTertiary"
        style={{ opacity: 0.3 }}
      />
      )}
      <Surface mt="xs">
        {children}
      </Surface>
    </Surface>
  )
}