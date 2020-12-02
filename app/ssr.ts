// FIXME: 这个 SSR 还有很多问题
// 目前先不解决这个
// 因为我找不到 @vue/server-renderer 的文档

import { renderToString } from '@vue/server-renderer';
import { createVueApp } from '../build/ssr/js/app.js';
import { promises as fs } from 'fs';
import { RouteMeta } from 'vue-router';

export type SSRContext = {
  url: string;
}

const template = await fs.readFile('dist/index.html', 'utf-8');
const gentemp = (meta: RouteMeta, render: string) => {
  const metastr = Object.keys(meta).map((key) => {
    if (key === 'title') {
      return `<title>${meta[key]}</title>`;
    } else {
      return `<meta name="${key}" content="${meta[key]}">`;
    }
  }).join('');

  return '<!-- attack204 AK world final -->' + template
    .replace('<meta charset="utf-8">', '<meta charset="utf-8">' + metastr)
    .replace('<div id="app"></div>', `<div id="app">${render}</div>`);
};

export default async (context: SSRContext) => {
  const { app, router } = createVueApp(true);
  router.push(context.url);
  await router.isReady();
  const html = await renderToString(app);

  return {
    code: router.currentRoute.value.name === 'NotFound' ? 404 : 200,
    html: gentemp(router.currentRoute.value.meta, html),
  };
};
