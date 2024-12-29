/* eslint-disable no-magic-numbers */
import { spacings } from "../theme/constants"
import { SpacingKeys, SpacingValues } from "../theme/types"

type StyleKeys =
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'
export type StyleProps = Partial<Record<StyleKeys, SpacingValues>>

export type Props = {
  base?: [SpacingKeys, SpacingKeys?, SpacingKeys?, SpacingKeys?] | SpacingKeys | false
  horizontal?: SpacingKeys | false
  vertical?: SpacingKeys | false
  top?: SpacingKeys | false
  right?: SpacingKeys | false
  bottom?: SpacingKeys | false
  left?: SpacingKeys | false
  type: 'margin' | 'padding'
  spacings: typeof spacings
}

export const getStyleSpacings = ({ base, horizontal, vertical, top, right, bottom, left, type, spacings }: Props): StyleProps => {
  const style: StyleProps = {}

  const spacingTop: StyleKeys = `${type}Top`
  const spacingRight: StyleKeys = `${type}Right`
  const spacingBottom: StyleKeys = `${type}Bottom`
  const spacingLeft: StyleKeys = `${type}Left`

  if (!Array.isArray(base) && base) {
    style[spacingTop] = spacings[base]
    style[spacingRight] = spacings[base]
    style[spacingBottom] = spacings[base]
    style[spacingLeft] = spacings[base]
  }
  if (Array.isArray(base) && base[0]) {
    style[spacingTop] = spacings[base[0]]
    style[spacingRight] = spacings[base[1] ?? base[0]]
    style[spacingBottom] = spacings[base[2] ?? base[0]]
    style[spacingLeft] = spacings[base[3] ?? base[1] ?? base[0]]
  }
  if (horizontal) {
    style[spacingRight] = spacings[horizontal]
    style[spacingLeft] = spacings[horizontal]
  }
  if (vertical) {
    style[spacingTop] = spacings[vertical]
    style[spacingBottom] = spacings[vertical]
  }
  if (top) {
    style[spacingTop] = spacings[top]
  }
  if (right) {
    style[spacingRight] = spacings[right]
  }
  if (bottom) {
    style[spacingBottom] = spacings[bottom]
  }
  if (left) {
    style[spacingLeft] = spacings[left]
  }

  return style
}
