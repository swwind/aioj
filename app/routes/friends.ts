import Router from "koa-router";
import { addNewFriend, deleteOldFriend, getFriendsList } from "../db.js";
import { LOGIN_REQUIRE } from "../errors.js";
import { State, Tools } from "../types.js";

const router = new Router<State, Tools>();

router.get('/friends', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const askRes = await getFriendsList(ctx.state.username);
  if (!askRes.ok) {
    ctx.end(400, askRes.error());
    return;
  }

  ctx.end(200, { friends: askRes.result() });
});

router.put('/friends/:username', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const res = await addNewFriend(ctx.state.username, ctx.params.username);
  if (!res.ok) {
    ctx.end(400, res.error());
    return;
  }

  ctx.end(200);
});

router.delete('/friends/:username', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const res = await deleteOldFriend(ctx.state.username, ctx.params.username);
  if (!res.ok) {
    ctx.end(400, res.error());
    return;
  }

  ctx.end(200);
});

export default router;