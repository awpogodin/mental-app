import React, { useRef } from 'react'
import CircularProgress, {
  ProgressRef,
} from 'react-native-circular-progress-indicator';

import { ColorKeys } from '../theme/types';
import { useTheme } from '../hooks/useTheme';

type Props = {
  /**
   * Размер спиннера
   * @default m
   */
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  /**
   * Цвет спиннера
   * @default iconDefault
   */
  color?: ColorKeys;
  /**
   * Продолжительность анимации лоадера
   */
  duration?: number;
};

const sizes = {
  xs: { r: 8, w: 2 },
  s: { r: 12, w: 2 },
  m: { r: 16, w: 2 },
  l: { r: 24, w: 3 },
  xl: { r: 32, w: 4 },
};

const DEFAULT_DURATION = 1000;

export const LoaderSpinner: React.FC<Props> = ({ size = 'm', color = 'iconDefault', duration = DEFAULT_DURATION, }) => {
  const { colors } = useTheme()
  const progressRef = useRef<ProgressRef>(null);

  const { r, w } = sizes[size];
  
  return (
    <CircularProgress
      ref={progressRef}
      value={100}
      radius={r}
      activeStrokeWidth={w}
      inActiveStrokeWidth={w}
      progressValueStyle={{ display: 'none' }}
      activeStrokeColor={colors[color]}
      inActiveStrokeColor={colors.iconSecondary}
      duration={duration}
      onAnimationComplete={() => {
        progressRef.current?.reAnimate();
      }}
    />
  )
}
