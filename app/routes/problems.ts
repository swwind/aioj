import { createNewProblem, deleteProblem, getAllProblems, getProblemAuthor, getProblemDetail, modifyProblem } from "app/db/problems";
import { LOGIN_REQUIRE, PARAMS_MISSING, PERMISSION_DENIED, PROBLEM_NOT_EXISTS, SERVER_ERROR } from "app/errors";
import Router from "koa-router";
import { State, Tools } from '../types';

const router = new Router<State, Tools>();

router.post('/p/new', async (ctx) => {
  if (!ctx.verifyBody([{
      name: 'title',
      type: 'string',
    }])) {
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

  const result = await createNewProblem(ctx.state.username, ctx.body.title);
  ctx.end(200, { pid: result.result() });
});

router.put('/p/:pid', async (ctx) => {
  if (!ctx.verifyBody([{
      name: 'title',
      type: 'string',
    }, {
      name: 'content',
      type: 'string',
    }, {
      name: 'hidden',
      type: 'boolean',
    }])) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const pid = Number(ctx.params.pid);
  const author = await getProblemAuthor(pid);

  if (!ctx.state.admin || ctx.state.username !== author) {
    ctx.end(401, PERMISSION_DENIED);
    return;
  }

  const { content, hidden, title } = ctx.body;
  await modifyProblem(pid, title, content, hidden);

  ctx.end(200);
});


router.delete('/p/:pid', async (ctx) => {
  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const pid = Number(ctx.params.pid);

  const author = await getProblemAuthor(pid);
  if (!ctx.state.admin || ctx.state.username !== author) {
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
