import { getLocales } from 'expo-localization';
import i18next, { LanguageDetectorAsyncModule } from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { initReactI18next } from "react-i18next";
import ru from './locales/ru';
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { logger } from '@/lib/logger';

const resources = {
  ru: {
    translation: ru,
  },
};

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: async () => {
    const storedLanguage = await AsyncStorage.getItem("@AppIntl:language");
    if (storedLanguage) {
      logger.info("storedLanguage", storedLanguage);
      return storedLanguage;
    }

    let phoneLanguage = getLocales()[0].languageCode ?? 'ru';

    logger.info("phoneLanguage", phoneLanguage);

    phoneLanguage = phoneLanguage.replace("_", "-");

    return phoneLanguage;
  },
  init: () => {},
  cacheUserLanguage: (language) => {
    AsyncStorage.setItem("@AppIntl:language", language);
  },
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ru",
    debug: false,
    compatibilityJSON: "v3",
    interpolation: {
      escapeValue: false,
    },
  });


dayjs.locale('ru') // use locale for dayjs

const i18n = i18next;

export default i18n;
