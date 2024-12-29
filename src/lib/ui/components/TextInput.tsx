import React, {
  forwardRef,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  KeyboardType,
  NativeSyntheticEvent,
  TextInput as NativeTextInput,
  Pressable,
  ReturnKeyType,
  StyleSheet,
  Text,
  TextInputFocusEventData,
  TextInputKeyPressEventData,
  TextInputSubmitEditingEventData,
} from "react-native";
import { mask as maskText, unMask } from "react-native-mask-text";

import { useTheme } from "../hooks/useTheme";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { Surface } from "../layouts/Surface";
import { FlexboxProps, OuterSpacingProps } from "../theme/propTypes";
import { createThemedStyles } from "../theme/createThemedStyles";
import { hexToRgba } from "../helpers/hexToRgba";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = Pick<FlexboxProps, "flex"> & {
  /**
   * Значение текстового поля
   */
  value?: string;
  /**
   * Заглушка для пустого текстового поля
   */
  placeholder?: string;
  /**
   * Префикс перед текстовым полем
   */
  prefix?: string;
  /**
   * Текст для дополнительной информации под текстовым полем
   */
  caption?: string;
  /**
   * Имя иконки
   */
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  /**
   * Наличие ошибки
   */
  error?: boolean;
  /**
   * Статус активности. Меняет отрисовку состояния и блокирует вызовы onChangeText
   */
  disabled?: boolean;
  /**
   * Автоматическое выделение текста при фокусе
   */
  selectTextOnFocus?: boolean;
  /**
   * Автоматический фокус
   */
  autoFocus?: boolean;
  /**
   * Тип клавиатуры для ввода
   */
  keyboardType?: KeyboardType;
  /**
   * Тип кнопки submit
   */
  returnKeyType?: ReturnKeyType;
  /**
   * Максимальная длина ввода
   */
  maxLength?: number;
  /**
   * Маска для текстового поля
   */
  mask?: string;
  /**
   * Добавляет кнопку очистки поля
   */
  withClear?: boolean;
  /**
   * Callback, вызываемый при изменении текста
   */
  onChangeText: (value: string) => void;
  /**
   * Callback вызывается, когда текстовое поле получает фокус
   */
  onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  /**
   * Callback вызывается, когда текстовое поле теряет фокус
   */
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  /**
   * Callback вызывается, когда происходит нажатие на кнопки клавиатуры
   */
  onKeyPress?: (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => void;
  /**
   * Callback вызывается, когда происходит нажатие на submit
   */
  onSubmitEditing?: (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  /**
   * Многострочный ввод
   */
  multiline?: boolean;
  /**
   * Поле будет терять фокус, когда происходит нажатие на submit
   */
  blurOnSubmit?: boolean;
  /**
   * Позволяет перезаписать стандартные обработчики focus, blur и тд.
   */
  getImperativeHandlers?: (
    ref: RefObject<NativeTextInput>
  ) => Partial<TextInputHandles>;
} & Pick<React.ComponentProps<typeof NativeTextInput>, "autoCapitalize" | 'editable'> &
  OuterSpacingProps;

export type TextInputHandles = Pick<
  NativeTextInput,
  "focus" | "clear" | "blur" | "isFocused" | "setNativeProps"
>;

export const TextInput = forwardRef<TextInputHandles, Props>(
  (
    {
      value,
      placeholder,
      prefix,
      caption,
      icon,
      error,
      disabled,
      selectTextOnFocus,
      autoFocus,
      keyboardType,
      maxLength,
      mask,
      withClear,
      autoCapitalize,
      editable = true,
      onChangeText,
      onFocus,
      onBlur,
      onKeyPress,
      onSubmitEditing,
      blurOnSubmit,
      multiline,
      returnKeyType,
      getImperativeHandlers,
      ...rest
    },
    ref
  ) => {
    const innerRef = useRef<NativeTextInput>(null);
    useImperativeHandle(ref, () => ({
      focus: () => innerRef.current?.focus(),
      clear: () => innerRef.current?.clear(),
      setNativeProps: (args: object) => innerRef.current?.setNativeProps(args),
      isFocused: () => innerRef.current?.isFocused() || false,
      blur: () => innerRef.current?.blur(),
      forceFocus: () => innerRef.current?.focus(),
      ...getImperativeHandlers?.(innerRef),
    }));

    const { colors, iconSizes } = useTheme();
    const style = useThemedStyles(styles);

    const [focused, setFocused] = useState<boolean>(false);

    const handleFocus = (
      event: NativeSyntheticEvent<TextInputFocusEventData>
    ) => {
      setFocused(true);

      selectTextOnFocus &&
        innerRef.current?.setNativeProps({
          selection: { start: 0, end: value?.length ?? 0 },
        });

      onFocus?.(event);
    };

    const handleBlur = (
      event: NativeSyntheticEvent<TextInputFocusEventData>
    ) => {
      setFocused(false);
      onBlur?.(event);
    };

    const maskedValue = mask ? maskText(value ?? "", mask) : value;

    const handleChangeText = (text: string) => {
      const v = mask ? unMask(text) : text;
      selectTextOnFocus && innerRef.current?.setNativeProps({ selection: {} });

      if (
        keyboardType === "decimal-pad" ||
        keyboardType === "number-pad" ||
        keyboardType === "numeric" ||
        keyboardType === "phone-pad"
      ) {
        onChangeText(v.replace(/[^0-9]/g, ""));
      } else {
        onChangeText(v);
      }
    };
    
    const handleClear = () => {
      handleChangeText('');
    };

    const inputContainerStyle = StyleSheet.flatten([
      style.inputContainer,
      focused && style.focusedInputContainer,
      multiline && style.multilineInputContainer,
      error && style.errorInputContainer,
      disabled && style.disabledInputContainer,
    ]);

    const captionStyle = StyleSheet.flatten([
      style.captionText,
      error && style.errorCaptionText,
    ]);

    const renderInput = () => {
      return (
        <NativeTextInput
          ref={innerRef}
          editable={!disabled && editable}
          value={maskedValue}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={onKeyPress}
          selectTextOnFocus={selectTextOnFocus}
          autoComplete="off"
          returnKeyType={returnKeyType}
          autoFocus={autoFocus}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          style={style.textInput}
          autoCapitalize={autoCapitalize}
        />
      );
    };

    return (
      <Surface flex={1} {...rest}>
        <Surface pv="xs" ph="md" style={inputContainerStyle}>
          {!!prefix && (
            <NativeTextInput
              value={prefix}
              editable={false}
              style={style.prefix}
            />
          )}
          {!!icon && (
            <Ionicons
              name={icon}
              color={colors.iconDefault}
              size={iconSizes.m}
            />
          )}
          {renderInput()}
          {withClear && !!value && (
            <Pressable onPress={handleClear}>
              {({ pressed }) => (
                <Ionicons
                  style={{ opacity: pressed ? 0.5 : 1 }}
                  name="close-outline"
                  color={colors.iconDefault}
                  size={iconSizes.m}
                />
              )}
            </Pressable>
          )}
        </Surface>
        {!!caption && <Text style={captionStyle}>{caption}</Text>}
      </Surface>
    );
  }
);

TextInput.displayName = "TextInput";

const styles = createThemedStyles((theme) => ({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacings.xs,
    minHeight: theme.sizes.controlDefault,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radii.l,
  },
  multilineInputContainer: {
    alignItems: "flex-start",
    minHeight: 112,
  },
  errorInputContainer: {
    backgroundColor: hexToRgba(theme.colors.surfaceError, 0.1),
  },
  focusedInputContainer: {},
  disabledInputContainer: {
    opacity: 0.5,
  },
  textInput: {
    flex: 1,
    alignSelf: "stretch",
    ...theme.typography.default,
    color: theme.colors.text,
    lineHeight: undefined,
  },
  prefix: {
    alignSelf: "stretch",
    ...theme.typography.default,
    color: theme.colors.textSecondary,
    marginRight: theme.spacings.xs,
    lineHeight: undefined,
  },
  captionText: {
    marginTop: theme.spacings.xs,
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  errorCaptionText: {
    color: theme.colors.textError,
  },
}));
