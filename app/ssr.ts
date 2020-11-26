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
  await router.push(context.url);
  await router.isReady();

  return {
    code: router.currentRoute.value.fullPath === '/404' ? 404 : 200,
    html: gentemp(router.currentRoute.value.meta, await renderToString(app, context)),
  };
}
