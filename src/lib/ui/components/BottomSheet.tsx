import React, { useCallback, useRef, useState } from "react";
import { Platform, SectionListData, StyleSheet } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetScrollView,
  BottomSheetSectionList,
} from "@gorhom/bottom-sheet";
import type {
  BottomSheetFlatListProps,
  BottomSheetSectionListProps,
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types";
import { useTheme } from "../hooks/useTheme";
import { useSafeAreaInsets } from "../hooks/useSafeAreaInsets";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { createThemedStyles } from "../theme/createThemedStyles";
import { Layout } from "../layouts/Layout";
import { ButtonBlock } from "../layouts/ButtonBlock";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { FullWindowOverlay } from "react-native-screens";
import { useKeyboard } from "../hooks/useKeyboard";

type Props<T, S> = {
  /**
   * Содержимое блока кнопок
   */
  buttons?: React.ReactNode;
  /**
   * Разрешить перехватывать нажатия для прокрутки
   */
  scrollable?: boolean;
  /**
   * Отображение элементов в блоке контента
   */
  children?: React.ReactNode;
  /**
   * Реф на SheetModal
   */
  sheetRef?: React.RefObject<BottomSheetModalMethods>;
  /**
   * Включить динамическое изменение размера для представления содержимого
   * @default true
   */
  enableDynamicSizing?: boolean;
} & Pick<
  React.ComponentProps<typeof BottomSheetModal>,
  | "enablePanDownToClose"
  | "index"
  | "snapPoints"
  | "onDismiss"
  | "onChange"
  | "onAnimate"
> &
  (S extends SectionListData<T, S>
    ? BottomSheetSectionListProps<T, S>
    : BottomSheetFlatListProps<T> | { sections?: SectionListData<T, S> });

type DefaultSection = {
  [key: string]: unknown;
};

export const BottomSheet = <T, S extends DefaultSection = DefaultSection>(
  props: Props<T, S>
): JSX.Element => {
  const {
    buttons,
    scrollable,
    sheetRef,
    children,

    enableDynamicSizing = true,
    enablePanDownToClose = false,
    index,
    snapPoints,
    onDismiss,
    onChange,
    onAnimate,
  } = props;

  const style = useThemedStyles(styles);
  const { spacings } = useTheme();
  const { keyboardShown, keyboardHeight } = useKeyboard();
  const defaultRef = useRef<BottomSheetModal | null>(null);

  const correctRef = sheetRef ? sheetRef : defaultRef;

  const insets = useSafeAreaInsets();

  const [layoutHeight, setLayoutHeight] = useState(0);
  const isScrollable =
    scrollable ||
    !!(props as BottomSheetFlatListProps<T>).data ||
    !!(props as BottomSheetSectionListProps<T, S>).sections;

  const keyboardOffset = keyboardShown ? keyboardHeight : 0;

  const containerStyle = StyleSheet.flatten([
    style.content,
    !isScrollable &&
      !!insets.bottom && { paddingBottom: insets.bottom + keyboardOffset },
    isScrollable && { paddingBottom: insets.bottom + layoutHeight + keyboardOffset },
  ]);

  const renderWrapper = () => {
    if ((props as BottomSheetFlatListProps<T>).data) {
      const { data, renderItem, keyExtractor } =
        props as BottomSheetFlatListProps<T>;
      return (
        <BottomSheetFlatList
          data={data}
          renderItem={renderItem}
          ListHeaderComponent={content}
          keyExtractor={keyExtractor}
          contentContainerStyle={containerStyle}
          keyboardShouldPersistTaps="handled"
        />
      );
    }

    if ((props as BottomSheetSectionListProps<T, S>).sections) {
      const { sections, renderItem, renderSectionHeader, keyExtractor } =
        props as BottomSheetSectionListProps<T, S>;
      return (
        <BottomSheetSectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={content}
          keyExtractor={keyExtractor}
          contentContainerStyle={containerStyle}
          keyboardShouldPersistTaps="handled"
        />
      );
    }

    if (scrollable) {
      return (
        <BottomSheetScrollView
          contentContainerStyle={containerStyle}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </BottomSheetScrollView>
      );
    }

    return (
      <BottomSheetScrollView
        contentContainerStyle={containerStyle}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {content}
      </BottomSheetScrollView>
    );
  };

  const content = (
    <>
      {children}

      {!!buttons && !isScrollable && (
        <Layout mt="xl">
          <ButtonBlock type="bottom-sheet">{buttons}</ButtonBlock>
        </Layout>
      )}
    </>
  );

  const backdropComponent: BottomSheetProps["backdropComponent"] = (
    backdropProps
  ) => (
    <BottomSheetBackdrop
      {...backdropProps}
      opacity={0.3}
      pressBehavior={enablePanDownToClose ? "close" : "none"}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
    />
  );

  const footerComponent: BottomSheetProps["footerComponent"] = (props) => {
    return (
      <BottomSheetFooter {...props}>
        <ButtonBlock onChangeHeight={setLayoutHeight} bg="background">
          {buttons}
        </ButtonBlock>
      </BottomSheetFooter>
    );
  };

  const containerComponent = useCallback(
    ({ children }: { children?: React.ReactNode }) => (
      <FullWindowOverlay>{children}</FullWindowOverlay>
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={correctRef}
      enablePanDownToClose={enablePanDownToClose}
      style={style.common}
      handleStyle={style.handle}
      handleIndicatorStyle={style.indicator}
      onDismiss={onDismiss}
      onChange={onChange}
      onAnimate={onAnimate}
      topInset={insets.top + spacings.xxl}
      enableDynamicSizing={enableDynamicSizing}
      index={index}
      snapPoints={snapPoints}
      backdropComponent={backdropComponent}
      footerComponent={buttons && isScrollable ? footerComponent : undefined}
      containerComponent={
        Platform.OS === "ios" ? containerComponent : undefined
      }
      backgroundStyle={style.background}
    >
      {renderWrapper()}
    </BottomSheetModal>
  );
};

const styles = createThemedStyles((theme) => ({
  common: {
    borderTopRightRadius: theme.radii.l,
    borderTopLeftRadius: theme.radii.l,
    overflow: "hidden",
    backgroundColor: theme.colors.background,
  },
  indicator: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  handle: {
    backgroundColor: theme.colors.background,
  },
  content: {
    backgroundColor: theme.colors.background,
    padding: theme.spacings.md,
  },
  background: {
    backgroundColor: theme.colors.background,
  },
}));

export type { BottomSheetModal as BottomSheetRef };
