import Router from 'koa-router';
import { verify } from './db/auth';
import { isAdmin } from './db/accouts';
import { State, Tools } from './types';

import accouts from './routes/accouts';
import friends from './routes/friends';
import forum from './routes/forum';
import users from './routes/users';
import files, { getFileSource } from './routes/files';
import { renderToHTML } from './ssr';
import { Middleware } from 'koa';

const router = new Router<State, Tools>();

router.use('/', async (ctx, next) => {
  ctx.state.authorized = false;
  ctx.state.admin = false;
  ctx.end = (status: number, data?: Object | string) => {
    ctx.response.status = status;
    ctx.response.headers['Content-Type'] = 'application/json';
    ctx.response.body = JSON.stringify({
      status,
      ...(typeof data === 'string' ? { error: data } : data),
    });
  };
  ctx.verifyBody = (keys: string[]) => {
    for (const key of keys) {
      if (!ctx.request.body[key] && !(ctx.request.files && ctx.request.files[key])) {
        return false;
      }
    }
    return true;
  };

  const auth = ctx.cookies.get('auth');
  if (auth) {
    const username = await verify(auth);
    if (username) {
      ctx.state.authorized = true;
      ctx.state.username = username;
      const result = await isAdmin(username);
      if (result.ok) {
        ctx.state.admin = result.result();
      }
    } else {
      ctx.cookies.set('auth', '', { expires: new Date(0) });
    }
  }
  await next();
});

router.use('/api',
  accouts.routes(),
  accouts.allowedMethods(),
  friends.routes(),
  friends.allowedMethods(),
  forum.routes(),
  forum.allowedMethods(),
  users.routes(),
  users.allowedMethods(),
  files.routes(),
  files.allowedMethods(),
);

const supportedLanguages = ['en_us', 'zh_cn'];

function getLanguage(acceptedLanguages: string) {
  const acpt = acceptedLanguages.split(',')
    .map((s) => s.split(';')[0])
    .map((s) => s.toLowerCase())
    .map((s) => s.replace(/-/g, '_'));

  for (const lang of acpt) {
    for (const slang of supportedLanguages) {
      if (slang.startsWith(lang)) {
        return slang;
      }
    }
  }

  return supportedLanguages[0];
}

export default router;

export const ssr: Middleware = async (ctx) => {
  const lang = getLanguage(ctx.get('Accept-Language'));
  const cookie = ctx.get('Cookie');
  const { code, html } = await renderToHTML(ctx.url, lang, cookie);
  ctx.response.status = code;
  ctx.set('Content-Type', 'text/html');
  ctx.response.body = html;
};

export const cdnRouter = new Router();
cdnRouter.get('/f/:fid', getFileSource);
