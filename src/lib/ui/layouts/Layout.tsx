import { getStyleGaps } from "../helpers/getStyleGaps";
import { getStyleSpacings } from "../helpers/getStyleSpacings";
import { useSafeAreaInsets } from "../hooks/useSafeAreaInsets";
import { useTheme } from "../hooks/useTheme";
import {
  FlexboxProps,
  InnerSpacingProps,
  OuterSpacingProps,
  PositionProps,
} from "../theme/propTypes";
import { ColorKeys } from "../theme/types";
import React, { ReactNode, RefObject, useState } from "react";
import {
  LayoutChangeEvent,
  RefreshControlProps,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ButtonBlock } from "./ButtonBlock";

const zero = 0;

type Props = FlexboxProps &
  Pick<PositionProps, "minHeight"> &
  OuterSpacingProps &
  InnerSpacingProps & {
    /**
     * Заливка
     */
    bg?: ColorKeys;
    /**
     * Способность перехватывать нажатия для прокрутки
     */
    scrollable?: boolean;
    /**
     * Используется ли нижний safe отступ
     * @default true
     */
    useBottomSafeArea?: boolean;
    /**
     * Компонент для обеспечения pull-to-refresh функций
     */
    refreshControl?: React.ReactElement<RefreshControlProps>;
    /**
     * Отображение контента в блоке
     */
    children?: ReactNode;
    /**
     * Получение стиля
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Зафиксированный снизу блок для отображения кнопок
     */
    stickyFooter?: ReactNode;
    /**
     * Ссылка на элемент прокрутки
     */
    scrollRef?: RefObject<ScrollView>;
  } & Pick<
    ScrollViewProps,
    | "stickyHeaderHiddenOnScroll"
    | "stickyHeaderIndices"
    | "bounces"
    | "contentContainerStyle"
  >;

export const Layout: React.FC<Props> = ({
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
  minHeight,
  bg,
  scrollable,
  useBottomSafeArea = true,
  refreshControl,
  gap,
  rowGap,
  columnGap,
  children,
  style,
  contentContainerStyle,
  stickyFooter,
  scrollRef,
  stickyHeaderHiddenOnScroll,
  stickyHeaderIndices,
  bounces,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const { colors, spacings } = useTheme();
  const [layoutHeight, setLayoutHeight] = useState(zero);
  const [stickyFooterHeight, setStickyFooterHeight] = useState(zero);

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

  const gaps = getStyleGaps({
    gap: gap,
    rowGap: rowGap,
    columnGap: columnGap,
    spacings,
  });

  const layoutStyle = StyleSheet.flatten([
    rest,
    margins,
    !scrollable && paddings,
    !scrollable && !!minHeight && { minHeight },
    !!bg && { backgroundColor: colors[bg] },
    style,
  ]);
  const contentStyle = StyleSheet.flatten([
    paddings,
    gaps,
    !!minHeight && { minHeight: minHeight === '100%' ? layoutHeight : minHeight },
    !!stickyFooterHeight && {
      paddingBottom: stickyFooterHeight + (paddings.paddingBottom ?? zero),
    },
    !!insets.bottom &&
      !stickyFooterHeight && {
        paddingBottom:
          (useBottomSafeArea ? insets.bottom : zero) +
          (paddings.paddingBottom ?? zero),
      },
    contentContainerStyle,
  ]);

  const clonedRefreshControl =
    refreshControl &&
    React.cloneElement(refreshControl, {
      progressViewOffset: refreshControl.props.progressViewOffset,
    });

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayoutHeight(Math.floor(event.nativeEvent.layout.height));
  };

  if (scrollable) {
    return (
      <View style={{ flex: 1 }} onLayout={handleLayout}>
        <ScrollView
          ref={scrollRef}
          style={layoutStyle}
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
          refreshControl={clonedRefreshControl}
          stickyHeaderHiddenOnScroll={stickyHeaderHiddenOnScroll}
          stickyHeaderIndices={stickyHeaderIndices}
          bounces={bounces}
          automaticallyAdjustKeyboardInsets
        >
          {children}
        </ScrollView>
        {!!stickyFooter && (
          <ButtonBlock
            bg={bg}
            useBottomSafeArea={useBottomSafeArea}
            onChangeHeight={setStickyFooterHeight}
          >
            {stickyFooter}
          </ButtonBlock>
        )}
      </View>
    );
  }
  return <View style={layoutStyle}>{children}</View>;
};
