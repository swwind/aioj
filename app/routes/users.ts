import Router from 'koa-router';
import { getUserDetail, modifyUserDetail } from '../db/users';
import { LOGIN_REQUIRE, PARAMS_MISSING, PERMISSION_DENIED } from '../errors';
import { State, Tools } from '../types';

const router = new Router<State, Tools>();

router.put('/u/:username', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  if (!ctx.verifyBody([{
      name: 'description',
      type: 'string'
    }, {
      name: 'email',
      type: 'string'
    }])) {
    return ctx.end(400, PARAMS_MISSING);
  }

  if (ctx.state.username !== ctx.params.username && !ctx.state.admin) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  const { description, email } = ctx.request.body;

  const result = await modifyUserDetail(ctx.params.username, description, email);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200);
});

router.get('/u/:username', async (ctx) => {
  const result = await getUserDetail(ctx.params.username);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }
  ctx.end(200, { user: result.result() });
});

router.get('/whoami', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  const result = await getUserDetail(ctx.state.username);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200, { user: result.result() });
});

export default router;
