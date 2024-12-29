import { useTheme } from '../hooks/useTheme';
import { Surface } from '../layouts/Surface';
import { OuterSpacingProps } from '../theme/propTypes';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Props = {
  value: number;
} & OuterSpacingProps

const height = 6

export const Progress: React.FC<Props> = ({ value = 1, ...rest }) => {
  const { radii, colors } = useTheme()
  const [width, setWidth] = useState(1)

  const sharedProgress = useSharedValue(value)

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width)
  };

  useEffect(() => {
    sharedProgress.value = withTiming(value, { duration: 500 })
  }, [value, sharedProgress])

  const animatedStyle = useAnimatedStyle(() => ({
    height,
    borderRadius: radii.l,
    backgroundColor: colors.surfacePrimary,
    width: width * sharedProgress.value
  }))

  return (
    <Surface flex={1} {...rest} bg="surfaceSecondary" br="l" height={height} onLayout={handleLayout}>
      <Animated.View style={animatedStyle} />
    </Surface>
  )
}