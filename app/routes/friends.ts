import Router from "koa-router";
import { addNewFriend, deleteOldFriend, getFriendsList } from "../db/friends.js";
import { LOGIN_REQUIRE } from "../errors.js";
import { State, Tools } from "../types.js";

const router = new Router<State, Tools>();

router.get('/friends', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  const result = await getFriendsList(ctx.state.username);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200, { friends: result.result() });
});

router.get('/friends/:username', async (ctx) => {
  const result = await getFriendsList(ctx.params.username);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }
  ctx.end(200, { friends: result.result() });
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