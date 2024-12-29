import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OuterSpacingProps } from '../theme/propTypes';
import { useTheme } from '../hooks/useTheme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ColorKeys } from '../theme/types';
import { Surface } from '../layouts/Surface';
import { LoaderSpinner } from './LoaderSpinner';
import { createThemedStyles } from '../theme/createThemedStyles';

type Props = {
  /**
   * Внешний вид кнопки
   * @default primary
   */
  type?:
    | 'primary'
    | 'secondary'
    | 'text'
    | 'textInverted'
    | 'negative'
  /**
   * Имя иконки
   */
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  /**
   * Текст кнопки
   */
  text?: string;
  /**
   * Содержимое кнопки (отрисовывается вместо text)
   */
  content?: React.ReactNode;
  /**
   * Статус загрузки
   */
  loading?: boolean;
  /**
   * Статус активности. Меняет отрисовку состояния и блокирует вызовы onPress
   */
  disabled?: boolean;
  /**
   * Cb при нажатии
   */
  onPress?: () => void;
} & OuterSpacingProps;

export const Button: React.FC<Props> = ({
  type = 'primary',
  icon,
  text,
  content,
  loading,
  disabled,
  onPress,
  ...rest
}) => {
  const [pressed, setPressed] = useState(false);

  const { colors, iconSizes } = useTheme()

  const style = useThemedStyles(styles);

  const isMounted = useRef(false);

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
    type === 'primary' && style.buttonPrimary,

    type === 'secondary' && style.buttonSecondary,

    type === 'text' && style.buttonText,

    type === 'textInverted' && style.buttonTextInverted,

    type === 'negative' && style.buttonNegative,

    pressed && style.buttonPressedOrDisabled,
    disabled && style.buttonPressedOrDisabled,
  ]);

  const buttonTextStyle = StyleSheet.flatten([
    style.text,

    type === 'primary' && style.textPrimary,

    type === 'secondary' && style.textSecondary,

    type === 'text' && style.textText,

    type === 'textInverted' && style.textTextInverted,

    type === 'negative' && style.textNegative,
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

  return (
    <Surface flex={1} {...rest}>
      <Pressable
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={buttonStyle}
      >
        {loading ? (
          <LoaderSpinner size="s" color={color} />
        ) : (
          <>
            {!!content && !text && content}
            {!!text && !!icon && (
              <Ionicons style={style.icon} name={icon} color={colors[color]} size={iconSizes.s} />
            )}
            {!!text && !content && (
              <Text style={buttonTextStyle} numberOfLines={1}>{text}</Text>
            )}
          </>
        )}
      </Pressable>
    </Surface>
  );
};

const styles = createThemedStyles((theme) => ({
  buttonPressedOrDisabled: {
    opacity: 0.5,
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacings.md,
    borderRadius: theme.radii.l,
    minHeight: theme.sizes.controlDefault,
  },

  icon: {
    marginRight: theme.spacings.xs,
  },
  text: {
    ...theme.typography.titleMedium,
  },

  buttonPrimary: {
    backgroundColor: theme.colors.surfacePrimary,
  },

  buttonSecondary: {
    backgroundColor: theme.colors.surfaceSecondary,
  },

  buttonText: {},

  buttonTextInverted: {},

  buttonNegative: {
    backgroundColor: theme.colors.surfaceSecondary,
  },

  textPrimary: {
    color: theme.colors.textPrimary,
  },

  textSecondary: {
    color: theme.colors.textDefault,
  },

  textText: {
    color: theme.colors.textDefault,
  },

  textTextInverted: {
    color: theme.colors.textInverse,
  },

  textNegative: {
    color: theme.colors.textError,
  },
}));
