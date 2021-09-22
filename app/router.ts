import Router from 'koa-router';
import { verify } from './db/auth';
import { isAdmin } from './db/accouts';
import { State, Tools } from './types';

import accouts from './routes/accouts';
import friends from './routes/friends';
import problems from './routes/problems';
import forum from './routes/forum';
import users from './routes/users';
import bots from './routes/bots';
import rounds from './routes/rounds';
import files, { getFileSource } from './routes/files';

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
  ctx.verifyBody = (keys) => {
    for (const key of Object.keys(keys)) {
      if (keys[key] === 'string') {
        if (typeof ctx.request.body[key] !== 'string') {
          return false;
        }
        if (!ctx.request.body[key]) {
          return false;
        }
      }
      if (keys[key] === 'boolean') {
        if (typeof ctx.request.body[key] !== 'boolean') {
          return false;
        }
      }
      if (keys[key] === 'file') {
        if (!ctx.request.files) {
          return false;
        }
        if (!(key in ctx.request.files)) {
          return false;
        }
        if (Array.isArray(ctx.request.files[key])) {
          return false;
        }
      }
      if (keys[key] === 'number') {
        if (typeof ctx.request.body[key] !== 'number') {
          return false;
        }
      }
      if (Array.isArray(keys[key])) {
        const type = keys[key][0];
        if (!type) return false;
        const data = ctx.request.body[key];
        if (!Array.isArray(data)) {
          return false;
        }
        const all = (data as any[]).reduce<boolean>((data, now) => {
          if (typeof now !== type) {
            return false;
          }
          if (type === 'string' && !now) {
            return false;
          }
          return data;
        }, true);
        if (!all) {
          return false;
        }
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
  problems.routes(),
  problems.allowedMethods(),
  bots.routes(),
  bots.allowedMethods(),
  rounds.routes(),
  rounds.allowedMethods(),
);

export const cdnRouter = new Router();
cdnRouter.get('/f/:fid', getFileSource);

export default router;
