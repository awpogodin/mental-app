import { useTheme } from "../hooks/useTheme";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { Surface } from "../layouts/Surface";
import { createThemedStyles } from "../theme/createThemedStyles";
import { OuterSpacingProps } from "../theme/propTypes";
import React, { forwardRef } from "react";
import { StyleSheet, Text } from "react-native";
import { OtpInput as DefaultOtpInput, OtpInputRef } from "react-native-otp-entry";

type Props = {
  numberOfDigits?: number;
  /**
   * Текст для дополнительной информации под текстовым полем
   */
  caption?: string;
  /**
   * Наличие ошибки
   */
  error?: boolean;
  /**
   * Статус активности. Меняет отрисовку состояния и блокирует вызовы onChangeText
   */
  disabled?: boolean;
  /**
   * Callback, вызываемый при заполнении инпута
   */
  onFilled?: (text: string) => void;
} & OuterSpacingProps

export const OtpInput = forwardRef<OtpInputRef, Props>(({ numberOfDigits, caption, error, disabled, onFilled, ...rest }, ref) => {
  const { colors } = useTheme()
  const style = useThemedStyles(styles);

  const captionStyle = StyleSheet.flatten([
    style.captionText,
    !!error && style.errorCaptionText,
  ]);

  const pinCodeContainer = StyleSheet.flatten([
    style.pinCodeContainer,
    disabled && style.disabledPinCodeContainer,
  ])

  return (
    <Surface {...rest}>
      <DefaultOtpInput
        ref={ref}
        disabled={disabled}
        numberOfDigits={numberOfDigits}
        onFilled={onFilled}
        focusColor={colors.textPrimary}
        theme={{
          containerStyle: style.container,
          pinCodeContainerStyle: pinCodeContainer,
          pinCodeTextStyle: style.pinCodeText,
          focusStickStyle: style.focusStick,
          focusedPinCodeContainerStyle: style.activePinCodeContainer,
        }}
      />
      {!!caption && <Text style={captionStyle}>{caption}</Text>}
    </Surface>
  );
});

export { type OtpInputRef }

OtpInput.displayName = "OtpInput";

const styles = createThemedStyles((theme) => ({
  container: {
    justifyContent: 'flex-start',
    gap: theme.spacings.xs,
  },
  pinCodeContainer: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderColor: theme.colors.surfaceSecondary,
  },
  disabledPinCodeContainer: {
    opacity: 0.5
  },
  pinCodeText: {
    ...theme.typography.headlineMedium,
    color: theme.colors.text,
  },
  focusStick: {},
  activePinCodeContainer: {
    borderColor: theme.colors.surfaceSecondary
  },
  captionText: {
    marginTop: theme.spacings.md,
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  errorCaptionText: {
    color: theme.colors.textError,
  },
}));
