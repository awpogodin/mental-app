import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { durations, iconSizes, radii, sizes, spacings } from './constants';
import { colors } from './colors';
import { typography } from './typography';

export type ColorKeys = keyof typeof colors;
type ColorsType = Record<ColorKeys, string>;

export type TypographyKeys = keyof typeof typography;

export type SpacingKeys = keyof typeof spacings;
export type SpacingValues = typeof spacings[SpacingKeys];

export type IconSizeKeys = keyof typeof iconSizes;

export type Theme = {
  dark: boolean;
  spacings: typeof spacings;
  colors: ColorsType;
  durations: typeof durations;
  typography: typeof typography;
  radii: typeof radii;
  sizes: typeof sizes;
  iconSizes: typeof iconSizes;
};

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

export type StylesCbType<S> = (theme: Theme) => S;
