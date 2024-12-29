import { StyleSheet } from 'react-native'
import { NamedStyles, StylesCbType } from "./types";

export const createThemedStyles = <T extends NamedStyles<T> | NamedStyles<unknown>>(
  stylesCb: StylesCbType<T>
): StylesCbType<T> => {
  return (theme) => StyleSheet.create(stylesCb(theme));
};
