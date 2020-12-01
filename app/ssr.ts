// FIXME: 这个 SSR 还有很多问题
// 目前先不解决这个
// 因为我找不到 @vue/server-renderer 的文档

import { renderToString } from '@vue/server-renderer';
import { createVueApp } from '../src';
import { promises as fs } from 'fs';
import { RouteMeta } from 'vue-router';

export type SSRContext = {
  url: string;
}

const template = await fs.readFile('src/index.prod.html', 'utf-8');
const gentemp = (meta: RouteMeta, render: string) => {
  const metastr = Object.keys(meta).map((key) => {
    if (key === 'title') {
      return `<title>${meta[key]}</title>`;
    } else {
      return `<meta name="${key}" content="${meta[key]}">`;
    }
  }).join('\n  ');

  return template
    .replace(/<!--vue-meta-outlet-->/g, metastr)
    .replace(/<!--vue-ssr-outlet-->/g, render)
};

export default async (context: SSRContext) => {
  const { app, router } = createVueApp(true);
  router.push(context.url);
  await router.isReady();
  const html = await renderToString(app, context);

  return {
    code: router.currentRoute.value.name === 'NotFound' ? 404 : 200,
    html: gentemp(router.currentRoute.value.meta, html),
  };
}
