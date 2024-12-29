/* eslint-disable no-magic-numbers */
import React, { ReactNode, useMemo } from 'react'
import { SectionList as NativeSectionList, SectionListData, SectionListProps, StyleSheet } from 'react-native'
import { InnerSpacingProps, OuterSpacingProps, PositionProps } from '../theme/propTypes'
import { useTheme } from '../hooks/useTheme'
import { useSafeAreaInsets } from '../hooks/useSafeAreaInsets'
import { getStyleSpacings } from '../helpers/getStyleSpacings'
import { ButtonBlock } from './ButtonBlock'

type Props<T, S> = SectionListProps<T, S> &
  Pick<PositionProps, 'minHeight'> & {
    /**
     * Зафиксированный снизу блок для отображения кнопок
     */
    stickyFooter?: ReactNode
  } & OuterSpacingProps &
  InnerSpacingProps

type DefaultSection = {
  [key: string]: unknown
}

export const SectionList = <T, S = DefaultSection>({
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
  renderSectionHeader,
  style,
  stickyFooter,
  ...rest
}: Props<T, S>): JSX.Element => {
  const { spacings } = useTheme()
  const insets = useSafeAreaInsets()

  const margins = getStyleSpacings({
    base: m,
    horizontal: mh,
    vertical: mv,
    top: mt,
    right: mr,
    bottom: mb,
    left: ml,
    type: 'margin',
    spacings,
  })

  const paddings = getStyleSpacings({
    base: p,
    horizontal: ph,
    vertical: pv,
    top: pt,
    right: pr,
    bottom: pb,
    left: pl,
    type: 'padding',
    spacings,
  })

  const layoutStyle = useMemo(() => StyleSheet.flatten([margins, style]), [margins, style])

  const contentStyle = useMemo(() => StyleSheet.flatten([
    paddings,
    !!minHeight && { minHeight },
    !!insets.bottom && { paddingBottom: insets.bottom + (paddings.paddingBottom ?? 0) },
  ]), [insets.bottom, minHeight, paddings])

  const renderHeader = (info: { section: SectionListData<T, S> }) => {
    // TODO: добавить китовый заголовок секции, при необходимости
    if (renderSectionHeader) {
      return renderSectionHeader(info)
    }

    return null
  }

  return (
    <>
      <NativeSectionList<T, S>
        {...rest}
        style={layoutStyle}
        contentContainerStyle={contentStyle}
        renderSectionHeader={renderHeader}
        stickySectionHeadersEnabled={false}
      />
      {!!stickyFooter && (
        <ButtonBlock>
        {stickyFooter}
      </ButtonBlock>
      )}
    </>
  )
}
