// FIXME: 这个 SSR 还有很多问题
// 目前先不解决这个
// 因为我找不到 @vue/server-renderer 的文档

import { renderToString } from '@vue/server-renderer';
import { createVueApp, setMockingCookie } from '../build/ssr/js/app.js';
import { promises as fs } from 'fs';
import { RouteMeta } from 'vue-router';
import { lock, unlock } from './utils';

const template = await fs.readFile('dist/index.html', 'utf-8');
const gentemp = (title: string, meta: RouteMeta, rendered: string, statestr: string) => {
  const metastr = `<title>${title}</title>` + Object.keys(meta).map((key) => {
    return `<meta name="${key}" content="${meta[key]}">`;
  }).join('');

  return '<!-- attack204 AK world final -->\n' + template
    .replace('<meta charset="utf-8">', '<meta charset="utf-8">' + metastr)
    .replace('<div id="app"></div>', `<div id="app">${rendered}</div>`)
    .replace('</head>', `<script>window.__INITIAL_STATE__=${statestr};</script></head>`);
};

export default async (url: string, lang: string, cookie: string) => {
  const { app, router, store } = createVueApp(true);
  store.commit('update_language', lang);

  await lock(); // sync lock
  router.push(url);
  await router.isReady();
  if (cookie) {
    setMockingCookie(cookie);
  }
  const html = await renderToString(app);
  setMockingCookie('');
  unlock(); // sync unlock

  const statestr = JSON.stringify(store.state)
    // xss: </script>
    .replace(/\//g, '\\/');

  return {
    code: store.state.ssr.status,
    html: gentemp(store.state.ssr.title, store.state.ssr.meta, html, statestr),
  };
};
