import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { Surface } from '../layouts/Surface';
import { OuterSpacingProps } from '../theme/propTypes';
import { createThemedStyles } from '../theme/createThemedStyles';
import { Text } from './Text';

type Props = {
  /**
   * Заголовок
   */
  title: string;
  /**
   * Описание
   */
  description?: string;
  /**
   * Статус активности. Меняет отрисовку состояния и блокирует вызовы onPress
   */
  disabled?: boolean;
  /**
   * Функция для исполнения при нажатии
   */
  onPress?: () => void;
} & OuterSpacingProps;

export const MenuItem: React.FC<Props> = ({
  title,
  description,
  disabled,
  onPress,
  ...rest
}) => {
  const [pressed, setPressed] = useState(false);

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

  const chatItemStyle = StyleSheet.flatten([
    style.chatItem,
    pressed && style.chatItemPressedOrDisabled,
    disabled && style.chatItemPressedOrDisabled,
  ]);

  return (
    <Surface {...rest}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={chatItemStyle}
      >
        <Surface flex={1}>
          <Text type="titleMedium" text={title}/>
          {!!description && (<Text type="labelLarge" color="textSecondary" text={description}/>)}
        </Surface>
      </Pressable>
    </Surface>
  );
};

const styles = createThemedStyles((theme) => ({
  chatItem: {
    flexDirection: 'row',
    gap: theme.spacings.sm
  },
  chatItemPressedOrDisabled: {
    opacity: 0.5,
  },
}));
