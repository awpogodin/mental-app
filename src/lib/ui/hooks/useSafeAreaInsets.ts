import React from 'react'
import { EdgeInsets, SafeAreaInsetsContext } from 'react-native-safe-area-context'

export const useSafeAreaInsets = (): EdgeInsets => {
  const safeArea = React.useContext(SafeAreaInsetsContext)
  if (safeArea == null) {
    return { top: 0, right: 0, bottom: 0, left: 0}
  }
  return safeArea
}