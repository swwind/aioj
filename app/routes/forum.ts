import Router from "koa-router";
import { createComment, createPost, createRegion, deleteComment, deletePost, deleteRegion, getCommentDetail, getPostComments, getPostDetail, getPostsList, getRegionsList, modifyComment, modifyPost, modifyRegion } from "../db/forum.js";
import { LOGIN_REQUIRE, PARAMS_MISSING, PERMISSION_DENIED } from "../errors.js";
import { State, Tools } from "../types.js";

const router = new Router<State, Tools>();

router.post('/r/:region/:pid/comment', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  if (!ctx.verifyBody(['content'])) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const result = await createComment(
    ctx.params.region,
    Number(ctx.params.pid),
    ctx.state.username,
    ctx.request.body.content);
  if (!result.ok) {
    ctx.end(400, result.error());
    return;
  }

  ctx.end(200, { cid: result.result() });
});

router.post('/r/:region/post', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  if (!ctx.verifyBody(['title', 'content'])) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const result = await createPost(
    ctx.params.region,
    ctx.request.body.title,
    ctx.state.username,
    ctx.request.body.content);
  if (!result.ok) {
    ctx.end(400, result.error());
    return;
  }

  ctx.end(200, { pid: result.result() });
});

router.post('/r/:region', async (ctx) => {
  if (!ctx.state.admin) {
    ctx.end(403, PERMISSION_DENIED);
    return;
  }

  if (!ctx.verifyBody(['description', 'title'])) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const result = await createRegion(ctx.params.region, ctx.request.body.title, ctx.request.body.description);
  if (!result.ok) {
    ctx.end(400, result.error());
    return;
  }

  ctx.end(200);
});

router.put('/r/:region/:pid/:cid', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const cd = await getPostDetail(ctx.params.region, Number(ctx.params.pid));
  if (!cd.ok) {
    ctx.end(404, cd.error());
    return;
  }

  if (!ctx.state.admin && cd.result().author !== ctx.state.username) {
    ctx.end(403, PERMISSION_DENIED);
    return;
  }

  if (!ctx.verifyBody(['content'])) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const result = await modifyComment(
    ctx.params.region,
    Number(ctx.params.pid),
    Number(ctx.params.cid),
    ctx.request.body.content);
  if (!result.ok) {
    ctx.end(400, result.error());
    return;
  }

  ctx.end(200);
});

router.put('/r/:region/:pid', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const pd = await getPostDetail(ctx.params.region, Number(ctx.params.pid));
  if (!pd.ok) {
    ctx.end(404, pd.error());
    return;
  }

  if (!ctx.state.admin && pd.result().author !== ctx.state.username) {
    ctx.end(403, PERMISSION_DENIED);
    return;
  }

  if (!ctx.verifyBody(['title'])) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const result = await modifyPost(
    ctx.params.region,
    Number(ctx.params.pid),
    ctx.request.body.title);
  if (!result.ok) {
    ctx.end(400, result.error());
    return;
  }

  ctx.end(200);
});

router.put('/r/:region', async (ctx) => {
  if (!ctx.state.admin) {
    ctx.end(403, PERMISSION_DENIED);
    return;
  }

  if (!ctx.verifyBody(['description', 'title'])) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const result = await modifyRegion(ctx.params.region, ctx.request.body.title, ctx.request.body.description);
  if (!result.ok) {
    ctx.end(400, result.error());
    return;
  }

  ctx.end(200);
});

router.delete('/r/:region/:pid/:cid', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const cd = await getCommentDetail(ctx.params.region, Number(ctx.params.pid), Number(ctx.params.cid));
  if (!cd.ok) {
    ctx.end(404, cd.error());
    return;
  }

  if (!ctx.state.admin && cd.result().author !== ctx.state.username) {
    ctx.end(403, PERMISSION_DENIED);
    return;
  }

  const result = await deleteComment(
    ctx.params.region,
    Number(ctx.params.pid),
    Number(ctx.params.cid));
  if (!result.ok) {
    ctx.end(400, result.error());
    return;
  }

  ctx.end(200);
});

router.delete('/r/:region/:pid', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const pd = await getPostDetail(ctx.params.region, Number(ctx.params.pid));
  if (!pd.ok) {
    ctx.end(404, pd.error());
    return;
  }

  if (!ctx.state.admin && pd.result().author !== ctx.state.username) {
    ctx.end(403, PERMISSION_DENIED);
    return;
  }

  const result = await deletePost(ctx.params.region, Number(ctx.params.pid));
  if (!result.ok) {
    ctx.end(400, result.error());
    return;
  }

  ctx.end(200);
});

router.delete('/r/:region', async (ctx) => {
  if (!ctx.state.admin) {
    ctx.end(403, PERMISSION_DENIED);
    return;
  }

  const result = await deleteRegion(ctx.params.region);
  if (!result.ok) {
    ctx.end(400, result.error());
    return;
  }

  ctx.end(200);
});

router.get('/regions', async (ctx) => {
  ctx.end(200, { list: await getRegionsList() });
});
router.get('/r/:region/:pid', async (ctx) => {
  const pd = await getPostDetail(ctx.params.region, Number(ctx.params.pid));
  if (!pd.ok) {
    ctx.end(404, pd.error());
    return;
  }
  ctx.end(200, {
    ...pd.result(),
    comments: await getPostComments(ctx.params.region, Number(ctx.params.pid))
  });
});
router.get('/r/:region', async (ctx) => {
  ctx.end(200, { list: await getPostsList(ctx.params.region) });
});

export default router;
