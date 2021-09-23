import { getBotDetail, insertBotRecentRoundData } from '../db/bots';
import { getProblemDetail } from '../db/problems';
import { getRoundDetail, updateRoundState } from '../db/rounds';
import { judge } from './judge';

export async function prepareAndJudge(rid: number) {
  const round_detail = await getRoundDetail(rid);
  if (!round_detail) {
    await updateRoundState(rid, 'finish', 'error: Round not found');
    return;
  }

  const problem_detail = await getProblemDetail(round_detail.pid);
  if (!problem_detail) {
    await updateRoundState(rid, 'finish', 'error: Problem not found');
    return;
  }

  const judger_fid = problem_detail.fid;
  if (!judger_fid) {
    await updateRoundState(rid, 'finish', 'error: Problem does not have a judger');
    return;
  }

  const bot_fids: string[] = [];
  for (const bid of round_detail.bids) {
    const bot_detail = await getBotDetail(bid);
    if (!bot_detail) {
      await updateRoundState(rid, 'finish', `error: bot ${bid} not found`);
      return;
    }

    if (!bot_detail.fid) {
      await updateRoundState(rid, 'finish', `error: bot ${bid} invalid`);
      return;
    }

    bot_fids.push(bot_detail.fid);
  }

  await updateRoundState(rid, 'judging', '');

  const result = await judge(judger_fid, bot_fids);

  if (result.success) {
    await updateRoundState(rid, 'finish', JSON.stringify(result));
    for (let i = 0; i < round_detail.bids.length; ++ i) {
      await insertBotRecentRoundData(round_detail.bids[i], round_detail.pid, rid, result.result.players[i].isWinner);
    }
  } else {
    await updateRoundState(rid, 'error', result.error);
  }

};
