import * as ErrorMessages from 'app/errors';

export type InternationalizationLanguage = {
  home: string;
  about: string;
  forum: string;
  login: string;
  register: string;
  logout: string;
} & { [key in typeof ErrorMessages[keyof typeof ErrorMessages]]: string };
