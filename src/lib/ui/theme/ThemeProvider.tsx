import React from "react";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { DefaultTheme } from "./DefaultTheme";
import { DarkTheme } from "./DarkTheme";

const theme = { default: DefaultTheme, dark: DarkTheme };

export const ThemeContext = React.createContext(theme.default);
ThemeContext.displayName = "UIKitContext";

type Props = {
  /**
   * Ключ темы
   * @default 'default'
   */
  themeKey?: "default" | "dark";
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<Props> = ({
  themeKey = "default",
  children,
}) => {
  return (
    <ThemeContext.Provider value={theme[themeKey]}>
      <NavigationThemeProvider value={theme[themeKey]}>
        {children}
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
};
