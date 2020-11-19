import Router from "koa-router";
import { issueCookie, revoke, verify } from "./auth.js";
import { registerUser, verifyPassword } from "./db.js";
import { LOGIN_REQUIRE, LOGOUT_REQUIRE, PARAMS_MISSING } from "./errors.js";
import { State, Tools } from "./types.js";

const router = new Router<State, Tools>();

router.use('/', async (ctx, next) => {
  ctx.state.authorized = false;
  ctx.end = (status: number, data?: Object | string) => {
    ctx.response.status = status;
    ctx.response.headers['Content-Type'] = 'application/json';
    ctx.response.body = JSON.stringify({
      status,
      ...(typeof data === 'string' ? { error: data } : data)
    });
  }
  ctx.verifyBody = (keys: string[]) => {
    for (const key of keys) {
      if (typeof ctx.request.body[key] === 'undefined') {
        return false;
      }
    }
    return true;
  }

  const auth = ctx.cookies.get('auth');
  if (auth) {
    const username = verify(auth);
    if (username) {
      ctx.state.authorized = true;
      ctx.state.username = username;
    }
  }
  await next();
})

router.post('/api/login', async (ctx) => {
  if (ctx.state.authorized) {
    ctx.end(400, LOGOUT_REQUIRE);
    return;
  }

  if (!ctx.verifyBody(['username', 'password'])) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const verifyResult = await verifyPassword(ctx.request.body.username, ctx.request.body.password);
  if (verifyResult) {
    ctx.end(400, verifyResult);
    return;
  }

  const cookie = issueCookie(ctx.request.body.username);
  ctx.cookies.set('auth', cookie);
  ctx.end(200);
});

router.post('/api/register', async (ctx) => {
  if (ctx.state.authorized) {
    ctx.end(400, LOGOUT_REQUIRE);
    return;
  }

  console.log(ctx.request.body);
  if (!ctx.verifyBody(['username', 'password'])) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const registerRes = await registerUser(ctx.request.body.username, ctx.request.body.password);
  if (registerRes) {
    ctx.end(400, registerRes);
    return;
  }

  const cookie = issueCookie(ctx.request.body.username);
  ctx.cookies.set('auth', cookie);
  ctx.end(200);
});

router.get('/api/whoami', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  ctx.end(200, { username: ctx.state.username });
});

router.post('/api/logout', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  revoke(ctx.cookies.get('auth'));
  ctx.end(200);
});

export default router;
