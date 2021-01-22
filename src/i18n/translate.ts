import { InternationalizationLanguage } from './types';
import { languages } from '.';

function translate(lang: keyof typeof languages, str: keyof InternationalizationLanguage, ...pattern: string[]): string;
function translate(lang: string, str: string, ...pattern: string[]): string;
function translate(lang: any, str: any, ...pattern: string[]): string {
  let s = (languages as any)[lang][str];
  if (s) {
    for (const ptn of pattern) {
      s = s.replace('{}', ptn);
    }
    return s;
  }
  console.warn(`missing translate: ${lang}: ${str}`);
  return str;
}

export { translate };
