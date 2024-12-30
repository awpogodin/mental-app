import { TextStyle } from "react-native";

type TypographyStyle = Required<
  Pick<
    TextStyle,
    "fontFamily" | "fontSize" | "lineHeight" | "fontWeight" | "letterSpacing"
  >
>;

export const font = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  bold: "Inter_900Black",
};

const createTypography = (
  fontFamily: TypographyStyle["fontFamily"],
  fontSize: TypographyStyle["fontSize"],
  lineHeight: TypographyStyle["lineHeight"],
  fontWeight: TypographyStyle["fontWeight"] = "normal",
  letterSpacing: TypographyStyle["letterSpacing"] = 0
): TypographyStyle => ({
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
});

export const typography = {
  /**
   * @description Самый большой заголовок на странице. Используется для отображения главной темы контента.
   * Предназначен для использования на экранах больших размеров и выделения важной информации.
   */
  largeTitle: createTypography(font.bold, 34, 41),
  /**
   * @description Заголовок первого уровня. Используется для основных заголовков разделов или экранов.
   * Важен для иерархии контента, но меньше чем largeTitle.
   */
  title1: createTypography(font.bold, 28, 34),
  /**
   * @description Заголовок второго уровня. Обычно используется для заголовков подразделов или виджетов.
   * Менее важный чем title1, но все еще выделяется.
   */
  title2: createTypography(font.medium, 22, 28),
  /**
   * @description Заголовок третьего уровня. Подходит для заголовков менее значимых частей контента.
   *  Может использоваться для вторичных заголовков в блоках контента.
   */
  title3: createTypography(font.medium, 20, 25),
  /**
   * @description Заголовок для разделов или элементов интерфейса. Выделяется среди основного текста.
   *  Используется для заголовков списков, карточек, модальных окон.
   */
  headline: createTypography(font.bold, 17, 22),
  /**
   * @description Основной текст. Предназначен для основного содержания статьи, абзацев и т.д.
   * Это стандартный стиль для большей части текста на экране.
   */
  body: createTypography(font.regular, 17, 22),
  /**
   * @description Второстепенный текст, выделяющийся из основного. Используется для кратких подписей или пояснений.
   * Может быть использован для описаний, подсказок.
   */
  callout: createTypography(font.regular, 16, 21),
  /**
   * @description Заголовок для небольших текстов, располагающихся под заголовком или рядом с ним.
   * Может использоваться в карточках, в заголовках для подписей.
   */
  subheadline: createTypography(font.medium, 15, 20),
  /**
   * @description Текст для небольших примечаний или ссылок в нижней части экрана.
   * Используется для авторских прав, сносок, информации о приложении.
   */
  footnote: createTypography(font.regular, 13, 18),
  /**
   * @description Текст для подписей или пояснений, наименьшего размера.
   *  Подходит для пояснений к изображениям, датам, авторству.
   */
  caption1: createTypography(font.regular, 12, 16),
  /**
   * @description Самый маленький текст для мелких деталей.
   * Используется для вспомогательной информации в самом низу экрана или на сложных элементах.
   */
  caption2: createTypography(font.regular, 11, 13),

  /**
   * @description Стиль текста для кнопок. Используется в интерактивных элементах.
   */
  button: createTypography(font.medium, 17, 22),
  /**
   * @description Стиль текста для меток. Используется для подписей к полям ввода, элементам формы.
   */
  label: createTypography(font.medium, 12, 16),

  /**
   * @description Стиль текста по умолчанию, обычно используется как основной текст(body).
   */
  default: createTypography(font.regular, 17, 22),
} as const;
