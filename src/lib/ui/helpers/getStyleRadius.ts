import { radii } from "../theme/constants"
import { BorderRadiusProps } from "../theme/propTypes"

type RadiusKeys =
  | 'borderRadius'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
export type StyleProps = Partial<Record<RadiusKeys, number>>

export type Props = BorderRadiusProps & {
  radii: typeof radii
}

export const getStyleRadius = ({ br, brTop, brRight, brBottom, brLeft, radii }: Props) => {
  const style: StyleProps = {}

  if (br) {
    style.borderRadius = radii[br]
  }
  if (brTop) {
    style.borderTopLeftRadius = radii[brTop]
    style.borderTopRightRadius = radii[brTop]
  }
  if (brRight) {
    style.borderTopRightRadius = radii[brRight]
    style.borderBottomRightRadius = radii[brRight]
  }
  if (brBottom) {
    style.borderBottomLeftRadius = radii[brBottom]
    style.borderBottomRightRadius = radii[brBottom]
  }
  if (brLeft) {
    style.borderTopLeftRadius = radii[brLeft]
    style.borderBottomLeftRadius = radii[brLeft]
  }

  return style
}