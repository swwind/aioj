import { deleteFile, saveFileWithoutUser } from '../db/files';
import { modifyRegion } from '../db/forum';
import { createNewProblem, deleteProblem, getAllProblems, getProblemAuthor, getProblemDetail, modifyProblem, modifyProblemFid } from '../db/problems';
import { LOGIN_REQUIRE, PARAMS_MISSING, PERMISSION_DENIED, PROBLEM_NOT_EXISTS } from '../errors';
import Router from 'koa-router';
import { State, Tools } from '../types';
import { promises as fs } from 'fs';

const router = new Router<State, Tools>();

router.post('/p/new', async (ctx) => {
  if (!ctx.verifyBody({
    title: 'string',
  })) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  // TODO: open permission to trusted user
  if (!ctx.state.admin) {
    ctx.end(401, PERMISSION_DENIED);
    return;
  }

  const result = await createNewProblem(ctx.state.username, ctx.request.body.title);
  ctx.end(200, { pid: result.result() });
});

router.put('/p/:pid/file', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const pid = Number(ctx.params.pid);
  const pd = await getProblemDetail(pid);

  if (!pd) {
    ctx.end(404, PROBLEM_NOT_EXISTS);
    return;
  }

  if (!ctx.state.admin && ctx.state.username !== pd.author) {
    ctx.end(401, PERMISSION_DENIED);
    return;
  }

  let file = ctx.request.files?.file;
  if (!file) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }
  if (Array.isArray(file)) {
    file = file[0];
  }

  if (pd.fid) {
    await deleteFile(pd.fid);
  }

  const fid = await saveFileWithoutUser(await fs.readFile(file.path), `p${pid}_judger.zip`);
  await modifyProblemFid(pid, fid);
  const problem = await getProblemDetail(pid);

  ctx.end(200, { problem });
});

router.put('/p/:pid', async (ctx) => {
  if (!ctx.verifyBody({
    title: 'string',
    content: 'string',
    hidden: 'boolean',
    playerMin: 'number',
    playerMax: 'number',
    paint: 'string',
  })) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const pid = Number(ctx.params.pid);
  const author = await getProblemAuthor(pid);

  if (!ctx.state.admin && ctx.state.username !== author) {
    ctx.end(401, PERMISSION_DENIED);
    return;
  }

  const { content, hidden, title, paint, playerMin, playerMax } = ctx.request.body;
  await modifyProblem(pid, title, content, hidden, paint, playerMin, playerMax);
  await modifyRegion(`p${pid}`, title, title);

  const problem = await getProblemDetail(pid);

  ctx.end(200, { problem });
});

router.delete('/p/:pid', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const pid = Number(ctx.params.pid);

  const author = await getProblemAuthor(pid);
  if (!ctx.state.admin && ctx.state.username !== author) {
    ctx.end(401, PERMISSION_DENIED);
    return;
  }

  await deleteProblem(pid);

  ctx.end(200);
});

router.get('/problems', async (ctx) => {
  const result = await getAllProblems();
  ctx.end(200, { problems: result });
});
router.get('/p/:pid', async (ctx) => {
  const pid = Number(ctx.params.pid);
  const result = await getProblemDetail(pid);
  if (!result) {
    ctx.end(404, PROBLEM_NOT_EXISTS);
    return;
  }
  ctx.end(200, { problem: result });
});

export default router;
