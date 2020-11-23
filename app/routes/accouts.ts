import Router from "koa-router";
import { issueCookie, revoke } from "../auth.js";
import { registerUser, verifyPassword } from "../db/accouts.js";
import { LOGIN_REQUIRE, LOGOUT_REQUIRE, PARAMS_MISSING } from "../errors.js";
import { State, Tools } from "../types.js";

const router = new Router<State, Tools>();

router.post('/login', async (ctx) => {
  if (ctx.state.authorized) {
    return ctx.end(400, LOGOUT_REQUIRE);
  }

  if (!ctx.verifyBody(['username', 'password'])) {
    return ctx.end(400, PARAMS_MISSING);
  }

  const verifyRes = await verifyPassword(ctx.request.body.username, ctx.request.body.password);
  if (!verifyRes.ok) {
    return ctx.end(400, verifyRes.error());
  }

  const cookie = issueCookie(ctx.request.body.username);
  ctx.cookies.set('auth', cookie);
  ctx.end(200);
});

router.post('/register', async (ctx) => {
  if (ctx.state.authorized) {
    return ctx.end(400, LOGOUT_REQUIRE);
  }

  if (!ctx.verifyBody(['username', 'password'])) {
    return ctx.end(400, PARAMS_MISSING);
  }

  const registerRes = await registerUser(ctx.request.body.username, ctx.request.body.password);
  if (!registerRes.ok) {
    return ctx.end(400, registerRes.error());
  }

  const cookie = issueCookie(ctx.request.body.username);
  ctx.cookies.set('auth', cookie);
  ctx.end(200);
});

router.get('/whoami', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  ctx.end(200, { username: ctx.state.username });
});

router.post('/logout', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  revoke(ctx.cookies.get('auth'));
  ctx.end(200);
});

export default router;
