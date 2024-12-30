import { colors } from "../theme/colors";
import { ColorKeys } from "../theme/types";

export const isValidColorKey = (key?: string | null): key is ColorKeys => {
  return Object.keys(colors).includes(key as ColorKeys)
}
