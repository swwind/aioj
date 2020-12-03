import * as ErrorMessages from 'app/errors';

export type InternationalizationLanguage = {
  home: string;
  about: string;
  forum: string;
  login: string;
  register: string;
  logout: string;
  error: string;
  success: string;
  reply_success: string;
  admin: string;
  username: string;
  password: string;
  repeat_password: string;

  no_posts: string;
  no_regions: string;
  regions: string;
  create_new_region: string;
  create_new_post: string;
  reply: string;
  post_title: string;
  post_content: string;
  post: string;
  region_url: string;
  region_title: string;
  region_desc: string;
} & { [key in typeof ErrorMessages[keyof typeof ErrorMessages]]: string };
