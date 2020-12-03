/* eslint-disable no-console */

import Koa from 'koa';
import router, { ssr } from './app/router';
import body from 'koa-body';
import serve from 'koa-static';
import cors from '@koa/cors';
import config from './config.json';
import https from 'https';
import { promises as fs } from 'fs';

const app = new Koa();

const isProd = !process.env.TEST;

if (!isProd) {
  console.log('CORS closed');
  app.use(cors());
}

app.use(body({ multipart: true }));
app.use(serve('dist', { index: false }));
app.use(serve('static'));

app.use(router.routes());
app.use(router.allowedMethods());

if (isProd) {
  console.log('Server Side Rendering enabled');
  app.use(ssr);
}

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

  console.log(`Server started on http://localhost:${config.port}`);
}
