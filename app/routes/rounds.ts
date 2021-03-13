import { startNewRound } from '../db/rounds';
import { PARAMS_MISSING } from '../errors';
import { addToJudgerQueue } from '../judger/index';
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

  addToJudgerQueue(rid.result());

  ctx.end(200, { rid: rid.result() });
});

export default router;
