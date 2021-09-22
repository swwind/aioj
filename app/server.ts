import Koa from 'koa';
import router, { cdnRouter } from './router';
import body from 'koa-body';
import serve from 'koa-static';
import cors from '@koa/cors';
import config from '../config.json';
import https from 'https';
import c2k from 'koa-connect';
import { createServer, ViteDevServer } from 'vite';
import websocketify from 'koa-websocket';
import { promises as fs } from 'fs';
// import { createWSS } from './judger/wss';
// import { createWsRouter } from './routes/ws';

// @ts-ignore
import { render as SSRRender } from '../dist/server/entry-server.js';

const app = websocketify(new Koa());

const isProd = !process.env.DEV;
console.log('node env = ' + (process.env.DEV ? 'development' : 'production'));

let vite: ViteDevServer;
if (!isProd) {
  vite = await createServer({
    root: '.',
    logLevel: 'error',
    server: {
      middlewareMode: true
    }
  })
  // use vite's connect instance as middleware
  app.use(c2k(vite.middlewares));
  console.log('vite txdy');
} else {
  // app.use(require('compression')());
  app.use(serve('dist/client', { index: false }));
}

// ---

if (config.port === 443) {
  console.log('CORS stricted to ' + config.host);
  app.use(cors({ origin: config.host }));
}

app.on('error', (e) => {
  // ignore it
  // FIXME
  console.error(e);
});

if (config.port === 443) {
  console.log(`CDN stricted to ${config.cdn}`);
  const middleware: any = cdnRouter.routes();
  app.use(async (ctx, next) => {
    // check if is cdn
    if (ctx.host === config.cdn) {
      await middleware(ctx, async () => {
        ctx.response.status = 404;
        ctx.response.body = '404 NOT FOUND XD';
      });
    } else {
      await next();
    }
  });
} else {
  console.log('use local CDN')
  app.use(cdnRouter.routes());
}

app.use(body({ multipart: true }));
// app.use(serve('dist', { index: false }));
app.use(serve('public'));
app.use(serve('static'));

app.use(router.routes());
app.use(router.allowedMethods());

// const wss = createWSS();
// const wsrouter = createWsRouter(wss);

// app.ws.use(wsrouter.routes() as any);
// app.ws.use(wsrouter.allowedMethods() as any);

// SSR start =================

const indexProd = isProd ? await fs.readFile('dist/client/index.html', 'utf-8') : ''

import SSRManifest from '../dist/client/ssr-manifest.json';

const manifest = isProd ? SSRManifest : {}

app.use(async (ctx) => {
  try {
    const url = ctx.req.url || '/'

    let template, render: (url: string, manifest: Record<string, string[]>, cookie?: string) => Promise<string[]>;
    if (!isProd) {
      // always read fresh template in dev
      template = await fs.readFile('index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
    } else {
      template = indexProd
      render = SSRRender
    }
    const cookie = ctx.get('Cookie');

    const [appHtml, preloadLinks, metadata, initialState] = await render(url, manifest, cookie)

    const html = template
      .replace(`<!-- preload-links -->`, isProd ? metadata + initialState + preloadLinks : preloadLinks)
      .replace(`<!-- app-html -->`, appHtml)

    ctx.response.status = 200;
    ctx.response.set('Content-Type', 'text/html');
    ctx.response.body = html;
  } catch (e) {
    vite && vite.ssrFixStacktrace(e)
    console.error(e.stack)
    ctx.response.status = 500;
    ctx.response.set('Content-Type', 'text/html');
    ctx.response.body = e.stack;
  }
});

// SSR end =================

// HSTS start =================

if (config.port === 443) {
  const server = https.createServer({
    key: await fs.readFile(config.https.key),
    cert: await fs.readFile(config.https.cert),
  }, app.callback());
  server.listen(config.port);

  console.log('Congradulations! Server started on https://localhost');

  if (config.https.hsts) {
    const jump = new Koa();
    jump.use(async (ctx) => {
      ctx.redirect('https://' + ctx.host + ctx.url);
    });
    jump.listen(80);

    console.log('HSTS server started on http://localhost');
  }
} else {
  app.listen(config.port);

  console.log(`Test server started on http://localhost:${config.port}`);
}

// HSTS end =================
