import { InternationalizationLanguage } from './types';
import { languages } from '.';

export function translate(lang: keyof typeof languages, str: keyof InternationalizationLanguage) {
  return languages[lang][str];
}
