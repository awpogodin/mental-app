import React from 'react';
import { useSafeAreaInsets } from '../hooks/useSafeAreaInsets';
import { useTheme } from '../hooks/useTheme';
import { Surface } from '../layouts/Surface';

type Props = {
  title?: React.ReactNode
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const CustomHeader: React.FC<Props> = ({ title, headerLeft, headerRight }) => {
  const { top } = useSafeAreaInsets()
  const { spacings } = useTheme()

  return (
    <Surface ph="md" style={{paddingTop: spacings.xs + top, paddingBottom: spacings.xs }} justifyContent='space-between' flexDirection='row' alignItems='center' gap="md">
      {headerLeft}
      {title}
      {headerRight}
    </Surface>
  )
}
