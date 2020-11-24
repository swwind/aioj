import Router from "koa-router";
import { verify } from "./auth.js";
import { isAdmin } from "./db/accouts.js";
import { State, Tools } from "./types.js";

import accouts from "./routes/accouts.js";
import friends from "./routes/friends.js";
import forum from "./routes/forum.js";
import users from "./routes/users.js";
import files from "./routes/files.js";

const router = new Router<State, Tools>();

router.use('/', async (ctx, next) => {
  ctx.state.authorized = false;
  ctx.state.admin = false;
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
      const result = await isAdmin(username);
      if (result.ok) {
        ctx.state.admin = result.result();
      }
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

export default router;
