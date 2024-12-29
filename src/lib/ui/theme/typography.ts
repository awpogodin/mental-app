import { TextStyle } from "react-native";

type TypographyStyle = Required<Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'>>

export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_900Black',
}

const createTypography = (
  fontFamily: TypographyStyle['fontFamily'],
  fontSize: TypographyStyle['fontSize'],
  lineHeight: TypographyStyle['lineHeight'],
  fontWeight: TypographyStyle['fontWeight'] = "normal",
  letterSpacing: TypographyStyle['letterSpacing']= 0
): TypographyStyle => ({
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
});

export const typography = {
  displayLarge: createTypography(font.regular, 57, 64),
  displayMedium: createTypography(font.regular, 45, 52),
  displaySmall: createTypography(font.regular, 36, 44),

  headlineLarge: createTypography(font.medium, 32, 40),
  headlineMedium: createTypography(font.medium, 28, 36),
  headlineSmall: createTypography(font.medium, 24, 32),

  titleLarge: createTypography(font.medium, 22, 28),
  titleMedium: createTypography(font.medium, 16, 24),
  titleSmall: createTypography(font.medium, 14, 20, "normal", 0.1),

  labelLarge: createTypography(font.medium, 14, 20, "normal", 0.1),
  labelMedium: createTypography(font.medium, 12, 16, "normal", 0.5),
  labelSmall: createTypography(font.medium, 11, 16, "normal", 0.5),

  bodyLarge: createTypography(font.regular, 16, 24),
  bodyMedium: createTypography(font.regular, 14, 20, "normal", 0.25),
  bodySmall: createTypography(font.regular, 12, 16, "normal", 0.4),

  default: createTypography(font.regular, 16, 24),
} as const;
