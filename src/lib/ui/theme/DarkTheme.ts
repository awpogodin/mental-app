import { darkColors } from "./colors";
import { durations, iconSizes, radii, sizes, spacings } from "./constants";
import { Theme } from "./types";
import { typography } from "./typography";

export const DarkTheme: Theme = {
  dark: true,
  spacings,
  colors: darkColors,
  durations,
  typography,
  radii,
  sizes,
  iconSizes,
};
