/* eslint-disable no-magic-numbers */
import { spacings } from '../theme/constants';
import { SpacingKeys, SpacingValues } from '../theme/types';

type GapKeys = 'gap' | 'rowGap' | 'columnGap';

export type StyleProps = Partial<Record<GapKeys, SpacingValues>>;

export type Props = {
  gap?: SpacingKeys;
  rowGap?: SpacingKeys;
  columnGap?: SpacingKeys;
  spacings: typeof spacings;
};

export const getStyleGaps = ({
  gap,
  rowGap,
  columnGap,
  spacings,
}: Props): StyleProps => {
  const style: StyleProps = {};

  if (gap) {
    style.gap = spacings[gap];
  }
  if (rowGap) {
    style.rowGap = spacings[rowGap];
  }
  if (columnGap) {
    style.columnGap = spacings[columnGap];
  }

  return style;
};
