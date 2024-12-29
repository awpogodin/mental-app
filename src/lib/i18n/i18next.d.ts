import "i18next";
import ru from "./locales/ru";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: { translation: typeof ru };
  }
}
