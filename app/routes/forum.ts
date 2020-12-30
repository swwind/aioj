import Router from 'koa-router';
import { createComment, createPost, createRegion, deleteComment, deletePost, deleteRegion, getCommentDetail, getPostComments, getPostDetail, getPostsList, getRegionDetail, getRegionsList, modifyComment, modifyPost, modifyRegion } from '../db/forum';
import { LOGIN_REQUIRE, PARAMS_MISSING, PERMISSION_DENIED } from '../errors';
import { State, Tools } from '../types';

const router = new Router<State, Tools>();

router.post('/r/:region/:pid/comment', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  if (!ctx.verifyBody([{
    name: 'content',
    type: 'string',
  }, {
    name: 'markdown',
    type: 'string',
  }])) {
    return ctx.end(400, PARAMS_MISSING);
  }

  const result = await createComment(
    ctx.params.region,
    Number(ctx.params.pid),
    ctx.state.username,
    ctx.request.body.content,
    ctx.request.body.markdown);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200, { comment: result.result() });
});

router.post('/r/:region/post', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  if (!ctx.verifyBody([{
    name: 'title',
    type: 'string',
  }, {
    name: 'content',
    type: 'string',
  }, {
    name: 'markdown',
    type: 'boolean',
  }])) {
    return ctx.end(400, PARAMS_MISSING);
  }
  const { title, content, markdown } = ctx.request.body;

  const result = await createPost(ctx.params.region, title, ctx.state.username, content, markdown);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  ctx.end(200, { pid: String(result.result()) });
});

router.post('/r/:region', async (ctx) => {
  if (!ctx.state.admin) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  if (!ctx.verifyBody([{
    name: 'description',
    type: 'string',
  }, {
    name: 'title',
    type: 'string',
  }])) {
    return ctx.end(400, PARAMS_MISSING);
  }
  const { description, title } = ctx.request.body;

  const result = await createRegion(ctx.params.region, title, description, false);
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

  if (!ctx.verifyBody([{
    name: 'content',
    type: 'string',
  }])) {
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

  if (!ctx.verifyBody([{
    name: 'title',
    type: 'string',
  }])) {
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

  if (!ctx.verifyBody([{
    name: 'description',
    type: 'string',
  }, {
    name: 'title',
    type: 'string',
  }])) {
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
  ctx.end(200, { regions: await getRegionsList() });
});
router.get('/r/:region/:pid', async (ctx) => {
  const rd = await getRegionDetail(ctx.params.region);
  if (!rd.ok) {
    return ctx.end(404, rd.error());
  }
  const pd = await getPostDetail(ctx.params.region, Number(ctx.params.pid));
  if (!pd.ok) {
    return ctx.end(404, pd.error());
  }
  ctx.end(200, {
    post: pd.result(),
    comments: await getPostComments(ctx.params.region, Number(ctx.params.pid)),
    region: rd.result(),
  });
});
router.get('/r/:region', async (ctx) => {
  const detail = await getRegionDetail(ctx.params.region);
  if (!detail.ok) {
    return ctx.end(404, detail.error());
  }
  ctx.end(200, {
    region: detail.result(),
    posts: await getPostsList(ctx.params.region),
  });
});

export default router;
