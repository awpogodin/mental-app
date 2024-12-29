import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

const zero = 0

export const useLayoutSize = (): [
  [number, number],
  (event: LayoutChangeEvent) => void,
] => {
  const [sizes, setSizes] = useState<[number, number]>([zero, zero]);

  const onLayoutCb = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;

      setSizes([width, height]);
    },
    [setSizes],
  );

  return [sizes, onLayoutCb];
};
