export const colors = {
  // #region default colors
  primary: "#212121",
  background: "#ffffff",
  card: "#ffffff",
  text: "#212121",
  border: "#ffffffff",
  notification: "#FF3B30",
  // #endregion

  // #region bg colors group
  bgDefault: '#f5f2ea',
  bgSecondary: '#F2F2F7',
  // #endregion

  // #region surface colors group
  surfacePrimary: '#212121',
  surfaceSecondary: '#F5F5F5',
  surfaceTertiary: '#9E9E9E',
  surfaceError: '#F44336',

  surfaceCardWhite: '#f5f2ea',
  surfaceCardYellow: '#f5d867',
  surfaceCardGreen: '#9aab63',
  surfaceCardPurple: '#9e3dfb',
  surfaceCardBlue: '#b8caeb',
  surfaceCardPink: '#f5b8d8',
  // #endregion

  // #region foreground colors group
  // #endregion

  // #region border colors group
  borderSecondary: '#9E9E9E',
  // #endregion

  // #region text colors group
  textDefault: '#212121',
  textPrimary: '#ffffff',
  textSecondary: '#9E9E9E',
  textInverse: '#ffffff',
  textSuccess: '#4CAF50',
  textWarning: '#FFC107',
  textError: '#F44336',
  // #endregion

  // #region icon colors group
  iconDefault: '#212121',
  iconPrimary: '#ffffff',
  iconSecondary: '#9E9E9E',
  iconAccent: '#212121',
  iconError: '#F44336',
  // #endregion

  // #region custom colors group
  transparent: "transparent",
  skeleton: "#F5F5F5",
  // #endregion
} as const;

export const darkColors = {
  ...colors,
  // #region default colors
  primary: "#ffffff",
  background: "#000000",
  card: "#000000",
  text: "#ffffff",
  border: "#000000",
  notification: "#FF453A",
  // #endregion

  // #region bg colors group
  bgDefault: '#000000',
  bgSecondary: '#1C1C1E',
  // #endregion

  // #region surface colors group
  surfacePrimary: '#ffffff',
  surfaceSecondary: '#1C1C1E',
  surfaceTertiary: '#9E9E9E',
  surfaceAccent: '#d7fc52',
  surfaceError: '#F44336',
  // #endregion

  // #region foreground colors group
  // #endregion

  // #region border colors group
  borderAccent: '#d7fc52',
  borderSecondary: '#9E9E9E',
  // #endregion

  // #region text colors group
  textDefault: '#ffffff',
  textPrimary: '#212121',
  textSecondary: "#9E9E9E",
  textInverse: '#212121',
  textAccent: '#d7fc52',
  textSuccess: '#4CAF50',
  textWarning: '#FFC107',
  textError: '#F44336',
  // #endregion

  // #region icon colors group
  iconDefault: '#ffffff',
  iconPrimary: '#212121',
  iconSecondary: '#9E9E9E',
  iconAccent: '#212121',
  iconError: '#F44336',
  // #endregion

  // #region custom colors group
  transparent: "transparent",
  skeleton: "#424242",
  // #endregion
} as const;
