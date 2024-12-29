import { Animated, DimensionValue as DefaultDimensionValue, FlexAlignType } from 'react-native';
import { radii } from './constants';
import { ColorKeys, SpacingKeys } from './types';

type DimensionValue = Exclude<DefaultDimensionValue, Animated.AnimatedNode>

export type FlexboxProps = {
  /**
   * Возможность элемента заполнять пространство
   * @params {positive} - пропорция от размера родительского блока
   * @params {0} - не заполняет, размер равен width и height
   * @params {negative} - если хватает пространства то равен размерам, иначе при недостатке места ужимается до minHeight и minWidth
   */
  flex?: number;
  /**
   * Базовый размер элемента по главной оси. Зависит от направления row
   */
  flexBasis?: DimensionValue;
  /**
   * Управление направлением дочерних элементов в контейнере
   * @default column
   */
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /**
   * Определяет как свободное пространство будет распределяться по основной оси для дочерних элементов
   * @default 0
   */
  flexGrow?: number;
  /**
   * Определяет как дочерние элементы будут сжиматься по основной оси при недостатке места
   * @default 0
   */
  flexShrink?: number;
  /**
   * Определяет перенос дочерних элементов в контейнере
   * @default nowrap
   */
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  /**
   * Выравнивание дочерних элементов по основной оси
   * @default flex-start
   */
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  /**
   * управление выравниванием блоков по перекрестной оси
   */
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'space-between'
    | 'space-around';
  /**
   * выравнивание элементов по перекрестной оси
   * @default stretch
   */
  alignItems?: FlexAlignType;
  /**
   * переопределение выравнивания alignItems
   * @default auto
   */
  alignSelf?: 'auto' | FlexAlignType;
  /**
   * задает размер промежутка между строками и столбцами. Это shorthand для rowGap и columnGap.
   */
  gap?: SpacingKeys;
  /**
   * задает размер промежутка между строками элемента.
   */
  rowGap?: SpacingKeys;
  /**
   * задает размер промежутка между колонками элемента.
   */
  columnGap?: SpacingKeys;
};

export type PositionProps = {
  /**
   * Позиционирование относительно родителя
   * @default relative
   */
  position?: 'absolute' | 'relative';
  /**
   * Смещение от верхнего края компонента
   */
  top?: DimensionValue;
  /**
   * Смещение от кравого края компонента
   */
  right?: DimensionValue;
  /**
   * Смещение от нижнего края компонента
   */
  bottom?: DimensionValue;
  /**
   * Смещение от левого края компонента
   */
  left?: DimensionValue;
  /**
   * Высота элемента
   */
  height?: DimensionValue;
  /**
   * Ширина элемента
   */
  width?: DimensionValue;
  /**
   * Максимальная высота элемента
   */
  maxHeight?: DimensionValue;
  /**
   * Максимальная ширина элемента
   */
  maxWidth?: DimensionValue;
  /**
   * Минимальная высота элемента
   */
  minHeight?: DimensionValue;
  /**
   * Минимальная ширина элемента
   */
  minWidth?: DimensionValue;
  /**
   * Нахождение элемента в z координате
   */
  zIndex?: number;
};

export type InnerSpacingProps = {
  /**
   * padding внутренний отступ
   * @params {number} общий отступ
   * @params {[around]} общий отступ
   * @params {[vertical, horizontal]} отступ по горизонтали и вертикали
   * @params {[top, right, bottom]} отступ с каждой стороны
   * @params {[top, right, bottom, left]} отступ с каждой стороны
   */
  p?:
    | [SpacingKeys, SpacingKeys?, SpacingKeys?, SpacingKeys?]
    | SpacingKeys
    | false;
  /**
   * paddingVertical вертикальный внутренний отступ
   */
  pv?: SpacingKeys | false;
  /**
   * paddingHorizontal горизонтальный внутренний отступ
   */
  ph?: SpacingKeys | false;
  /**
   * paddingTop верхний внутренний отступ
   */
  pt?: SpacingKeys | false;
  /**
   * paddingRight внутренний отступ справа
   */
  pr?: SpacingKeys | false;
  /**
   * paddingBottom нижний внутренний отступ
   */
  pb?: SpacingKeys | false;
  /**
   * paddingLeft внутренний отступ слева
   */
  pl?: SpacingKeys | false;
};

export type OuterSpacingProps = {
  /**
   * margin внешний отступ
   * @params {number} общий отступ
   * @params {[around]} общий отступ
   * @params {[vertical, horizontal]} отступ по горизонтали и вертикали
   * @params {[top, right, bottom, left]} отступ с каждой стороны
   * @params {[top, right, bottom, left]} отступ с каждой стороны
   */
  m?:
    | [SpacingKeys, SpacingKeys?, SpacingKeys?, SpacingKeys?]
    | SpacingKeys
    | false;
  /**
   * marginVertical вертикальный внешний отступ
   */
  mv?: SpacingKeys | false;
  /**
   * marginHorizontal горизонтальный внешний отступ
   */
  mh?: SpacingKeys | false;
  /**
   * marginTop верхний внешний отступ
   */
  mt?: SpacingKeys | false;
  /**
   * marginRight внешний отступ справа
   */
  mr?: SpacingKeys | false;
  /**
   * marginBottom нижний внешний отступ
   */
  mb?: SpacingKeys | false;
  /**
   * marginLeft внешний отступ слева
   */
  ml?: SpacingKeys | false;
};

export type BorderProps = {
  /**
   * толщина нижней грани
   */
  borderBottomWidth?: number;
  /**
   * толщина левой грани
   */
  borderLeftWidth?: number;
  /**
   * толщина правой грани
   */
  borderRightWidth?: number;
  /**
   * толщина верхней грани
   */
  borderTopWidth?: number;
  /**
   * толщина грани
   */
  borderWidth?: number;
  /**
   * цвет грани
   */
  borderColor?: ColorKeys;
} & BorderRadiusProps;

export type BorderRadiusProps = {
  /**
   * скругление граней
   */
  br?: keyof typeof radii;
  /**
   * скругление верхней левой и правой граней
   */
  brTop?: keyof typeof radii;
  /**
   * скругление правой верхней и нижней граней
   */
  brRight?: keyof typeof radii;
  /**
   * скругление нижних левой и правой граней
   */
  brBottom?: keyof typeof radii;
  /**
   * скругление левой верхней и нижней граней
   */
  brLeft?: keyof typeof radii;
};
