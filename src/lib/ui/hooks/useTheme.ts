import React from "react"
import { ThemeContext } from "../theme/ThemeProvider"

export const useTheme = () => {
  return React.useContext(ThemeContext)
}