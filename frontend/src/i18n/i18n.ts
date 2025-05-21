import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import locale from './locale.json';
import LanguageDetector from "i18next-browser-languagedetector";


interface LocaleResource {
    [page: string]: {
        [key: string]: {
            [lang: string]: string;
        };
    };
}

interface Resources {
    [lang: string]: {
        translation: {
            [page: string]: {
                [key: string]: string;
            };
        };
    }
}

function toI18nResources(input: LocaleResource): Resources {
    const output: any = {};
  
    for (const pageKey in input) {
      if (input.hasOwnProperty(pageKey)) {
        const pageResource = input[pageKey];
        for (const key in pageResource) {
          if (pageResource.hasOwnProperty(key)) {
            const translations = pageResource[key];
            for (const lang in translations) {
              if (translations.hasOwnProperty(lang)) {
                if (!output[lang]) {
                  output[lang] = { translation: {} };
                }
                if (!output[lang].translation[pageKey]) {
                  output[lang].translation[pageKey] = {};
                }
                output[lang].translation[pageKey][key] = translations[lang];
              }
            }
          }
        }
      }
    }
    return output;
}

const resources = toI18nResources(locale);

i18n 
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        detection: {
            order: ['localStorage'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },
        interpolation: {
            escapeValue: false,
        },
        defaultNS: "translation"
    });

export default i18n;