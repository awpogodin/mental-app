import { NamedStyles, StylesCbType } from '../theme/types';
import { useTheme } from './useTheme';
import { useMemo } from 'react';

export const useThemedStyles = <S extends NamedStyles<S> | NamedStyles<unknown>>(
  stylesCb: StylesCbType<S>
) => {
  const theme = useTheme();

  return useMemo(() => {
    return stylesCb(theme);
  }, [theme, stylesCb]);
};
