import { getRoundDetail, startNewRound } from '../db/rounds';
import { PARAMS_MISSING, ROUND_NOT_EXISTS } from '../errors';
import { prepareAndJudge } from '../judger/index';
import { Tools, State } from '../types';
import Router from 'koa-router';

const router = new Router<State, Tools>();

router.post('/s/new', async (ctx) => {
  if (!ctx.verifyBody({
    pid: 'number',
    bids: ['number'],
  })) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const { pid, bids } = ctx.request.body;

  const rid = await startNewRound(pid, bids);
  if (!rid.ok) {
    ctx.end(500, rid.result());
    return;
  }

  prepareAndJudge(rid.result());

  ctx.end(200, { rid: rid.result() });
});

router.get('/s/:rid', async (ctx) => {
  const rid = Number(ctx.params.rid);
  const result = await getRoundDetail(rid);
  if (!result) {
    ctx.end(404, ROUND_NOT_EXISTS);
    return;
  }
  ctx.end(200, { round: result });
});

export default router;
