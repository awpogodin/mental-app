/* eslint-disable no-magic-numbers */
import React, { MutableRefObject, ReactNode, useMemo, useState } from "react";
import {
  FlatListProps,
  FlatList as FlatListRN,
  StyleSheet,
} from "react-native";
import {
  InnerSpacingProps,
  OuterSpacingProps,
  PositionProps,
} from "../theme/propTypes";
import { useTheme } from "../hooks/useTheme";
import { useSafeAreaInsets } from "../hooks/useSafeAreaInsets";
import { getStyleSpacings } from "../helpers/getStyleSpacings";
import { ButtonBlock } from "./ButtonBlock";
import { ColorKeys } from "../theme/types";

const zero = 0;

type RefProp =
  | ((instance: FlatListRN | null) => void)
  | MutableRefObject<FlatListRN | null>
  | null;
type Props<T> = FlatListProps<T> &
  Pick<PositionProps, "minHeight"> & {
    /**
     * Заливка
     */
    bg?: ColorKeys;
    /**
     * Зафиксированный снизу блок для отображения кнопок
     */
    stickyFooter?: ReactNode;
  } & OuterSpacingProps &
  InnerSpacingProps;

const List = <T,>(
  {
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
    ListHeaderComponent,
    minHeight,
    style,
    bg,
    stickyFooter,
    horizontal,
    ...rest
  }: Props<T>,
  ref: RefProp
) => {
  const { spacings, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [stickyFooterHeight, setStickyFooterHeight] = useState(zero);

  const isInverted = !!rest.inverted;

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

  const layoutStyle = useMemo(
    () =>
      StyleSheet.flatten([
        margins,
        !!bg && { backgroundColor: colors[bg] },
        style,
      ]),
    [bg, colors, margins, style]
  );

  const contentStyle = useMemo(
    () =>
      StyleSheet.flatten([
        paddings,
        !!minHeight && { minHeight },
        !!stickyFooterHeight &&
          !isInverted && {
            paddingBottom:
              stickyFooterHeight + (paddings.paddingBottom ?? zero),
          },
        !!insets.bottom &&
          !isInverted &&
          !stickyFooterHeight &&
          !horizontal && {
            paddingBottom: insets.bottom + (paddings.paddingBottom ?? 0),
          },
        !!stickyFooterHeight &&
          isInverted && {
            paddingTop: stickyFooterHeight + (paddings.paddingBottom ?? zero),
          },
        !!insets.bottom &&
          isInverted &&
          !stickyFooterHeight &&
          !horizontal && {
            paddingTop: insets.bottom + (paddings.paddingBottom ?? 0),
          },
      ]),
    [
      horizontal,
      insets.bottom,
      isInverted,
      minHeight,
      paddings,
      stickyFooterHeight,
    ]
  );

  return (
    <>
      <FlatListRN<T>
        {...rest}
        ref={ref}
        style={layoutStyle}
        contentContainerStyle={contentStyle}
        ListHeaderComponent={ListHeaderComponent}
        horizontal={horizontal}
        keyboardShouldPersistTaps="handled"
      />
      {!!stickyFooter && (
        <ButtonBlock bg={bg} onChangeHeight={setStickyFooterHeight}>
          {stickyFooter}
        </ButtonBlock>
      )}
    </>
  );
};

export const FlatList = React.forwardRef(List) as <T>(
  props: Props<T> & {
    ref?: RefProp;
  }
) => ReturnType<typeof List>;
