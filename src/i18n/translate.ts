import { InternationalizationLanguage } from './types';
import { languages } from '.';

export function translate(lang: keyof typeof languages, str: keyof InternationalizationLanguage, ...pattern: string[]) {
  let s = languages[lang][str];
  if (s) {
    for (const ptn of pattern) {
      s = s.replace('{}', ptn);
    }
  }
  return s;
}
