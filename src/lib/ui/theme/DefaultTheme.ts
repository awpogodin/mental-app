import { colors } from "./colors";
import { durations, iconSizes, radii, sizes, spacings } from "./constants";
import { Theme } from "./types";
import { typography } from "./typography";

export const DefaultTheme: Theme = {
  dark: false,
  spacings,
  colors: colors,
  durations,
  typography,
  radii,
  sizes,
  iconSizes,
};
