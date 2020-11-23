import Router from "koa-router";
import { createComment, createPost, createRegion, deleteComment, deletePost, deleteRegion, getCommentDetail, getPostComments, getPostDetail, getPostsList, getRegionsList, modifyComment, modifyPost, modifyRegion } from "../db/forum.js";
import { LOGIN_REQUIRE, PARAMS_MISSING, PERMISSION_DENIED } from "../errors.js";
import { State, Tools } from "../types.js";

const router = new Router<State, Tools>();

router.post('/r/:region/:pid/comment', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  if (!ctx.verifyBody(['content'])) {
    return ctx.end(400, PARAMS_MISSING);
  }

  const result = await createComment(
    ctx.params.region,
    Number(ctx.params.pid),
    ctx.state.username,
    ctx.request.body.content);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200, { cid: result.result() });
});

router.post('/r/:region/post', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  if (!ctx.verifyBody(['title', 'content'])) {
    return ctx.end(400, PARAMS_MISSING);
  }
  const { title, content } = ctx.request.body;

  const result = await createPost(ctx.params.region, title, ctx.state.username, content);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200, { pid: result.result() });
});

router.post('/r/:region', async (ctx) => {
  if (!ctx.state.admin) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  if (!ctx.verifyBody(['description', 'title'])) {
    return ctx.end(400, PARAMS_MISSING);
  }
  const { description, title } = ctx.request.body;

  const result = await createRegion(ctx.params.region, title, description);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200);
});

router.put('/r/:region/:pid/:cid', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  const cd = await getPostDetail(ctx.params.region, Number(ctx.params.pid));
  if (!cd.ok) {
    return ctx.end(404, cd.error());
  }

  if (!ctx.state.admin && cd.result().author !== ctx.state.username) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  if (!ctx.verifyBody(['content'])) {
    return ctx.end(400, PARAMS_MISSING);
  }

  const result = await modifyComment(
    ctx.params.region,
    Number(ctx.params.pid),
    Number(ctx.params.cid),
    ctx.request.body.content);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200);
});

router.put('/r/:region/:pid', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  const pd = await getPostDetail(ctx.params.region, Number(ctx.params.pid));
  if (!pd.ok) {
    return ctx.end(404, pd.error());
  }

  if (!ctx.state.admin && pd.result().author !== ctx.state.username) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  if (!ctx.verifyBody(['title'])) {
    return ctx.end(400, PARAMS_MISSING);
  }

  const result = await modifyPost(
    ctx.params.region,
    Number(ctx.params.pid),
    ctx.request.body.title);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200);
});

router.put('/r/:region', async (ctx) => {
  if (!ctx.state.admin) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  if (!ctx.verifyBody(['description', 'title'])) {
    return ctx.end(400, PARAMS_MISSING);
  }
  const { description, title } = ctx.request.body;

  const result = await modifyRegion(ctx.params.region, title, description);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200);
});

router.delete('/r/:region/:pid/:cid', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  const cd = await getCommentDetail(ctx.params.region, Number(ctx.params.pid), Number(ctx.params.cid));
  if (!cd.ok) {
    return ctx.end(404, cd.error());
  }

  if (!ctx.state.admin && cd.result().author !== ctx.state.username) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  const result = await deleteComment(
    ctx.params.region,
    Number(ctx.params.pid),
    Number(ctx.params.cid));
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200);
});

router.delete('/r/:region/:pid', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  const pd = await getPostDetail(ctx.params.region, Number(ctx.params.pid));
  if (!pd.ok) {
    return ctx.end(404, pd.error());
  }

  if (!ctx.state.admin && pd.result().author !== ctx.state.username) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  const result = await deletePost(ctx.params.region, Number(ctx.params.pid));
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200);
});

router.delete('/r/:region', async (ctx) => {
  if (!ctx.state.admin) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  const result = await deleteRegion(ctx.params.region);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200);
});

router.get('/regions', async (ctx) => {
  ctx.end(200, { list: await getRegionsList() });
});
router.get('/r/:region/:pid', async (ctx) => {
  const pd = await getPostDetail(ctx.params.region, Number(ctx.params.pid));
  if (!pd.ok) {
    return ctx.end(404, pd.error());
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
