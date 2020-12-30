import { getUserDetail } from 'app/db/users';
import Router from 'koa-router';
import { issueCookie, revoke } from '../db/auth';
import { registerUser, verifyPassword } from '../db/accouts';
import { LOGIN_REQUIRE, LOGOUT_REQUIRE, PARAMS_MISSING } from '../errors';
import { State, Tools } from '../types';

const router = new Router<State, Tools>();

router.post('/login', async (ctx) => {
  if (ctx.state.authorized) {
    return ctx.end(400, LOGOUT_REQUIRE);
  }

  if (!ctx.verifyBody([{
      name: 'username',
      type: 'string',
    }, {
      name: 'password',
      type: 'string',
    }])) {
    return ctx.end(400, PARAMS_MISSING);
  }

  const verifyRes = await verifyPassword(ctx.request.body.username, ctx.request.body.password);
  if (!verifyRes.ok) {
    return ctx.end(400, verifyRes.error());
  }

  const result = await getUserDetail(ctx.request.body.username);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  const cookie = await issueCookie(ctx.request.body.username);
  ctx.cookies.set('auth', cookie, { expires: new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000) });
  ctx.end(200, { user: result.result() });
});

router.post('/register', async (ctx) => {
  if (ctx.state.authorized) {
    return ctx.end(400, LOGOUT_REQUIRE);
  }

  if (!ctx.verifyBody([{
      name: 'username',
      type: 'string',
    }, {
      name: 'password',
      type: 'string',
    }])) {
    return ctx.end(400, PARAMS_MISSING);
  }

  const registerRes = await registerUser(ctx.request.body.username, ctx.request.body.password);
  if (!registerRes.ok) {
    return ctx.end(400, registerRes.error());
  }

  const result = await getUserDetail(ctx.request.body.username);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  const cookie = await issueCookie(ctx.request.body.username);
  ctx.cookies.set('auth', cookie, { expires: new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000) });
  ctx.end(200, { user: result.result() });
});

router.post('/logout', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  revoke(ctx.cookies.get('auth') as string);
  ctx.end(200);
});

export default router;
