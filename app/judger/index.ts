import { getBotDetail } from 'app/db/bots';
import { getProblemDetail } from 'app/db/problems';
import { getRoundDetail, updateRoundState } from 'app/db/rounds';
import { getTmpDir } from 'app/utils';
import { exec } from 'child_process';
import { run } from './judge';
import { WSS } from './wss';

const unzip = async (fid: string) => {
  const zip = `uploads/${fid}`;
  const dirname = await getTmpDir();
  return new Promise<string>((resolve, reject) => {
    exec(`unzip "${zip}" -d "${dirname}"`, (err) => {
      if (err) reject(err);
      else resolve(dirname);
    });
  });
};

export type Judger = (rid: number, jfid: string, bfid: string[], log: (data: string) => void) => Promise<void>;

let judger: Judger;

export const createJudger = (wss: WSS) => {
  judger = async (rid, jfid, bfid, log) => {
    const judgerpath = await unzip(jfid);
    const botspath = await Promise.all(bfid.map((bot) => unzip(bot)));
    await run(judgerpath, botspath, (data) => {
      log(data);
      wss.emit(rid, data);
    });
    wss.clear(rid);
  }
}

export const addToJudgerQueue = async (rid: number) => {
  const rd = await getRoundDetail(rid);
  if (!rd) {
    await updateRoundState(rid, 'finish', 'error: Round not found');
    return;
  }

  const pid = rd.pid;
  const pd = await getProblemDetail(pid);
  if (!pd) {
    await updateRoundState(rid, 'finish', 'error: Problem not found');
    return;
  }

  const jfid = pd.fid;
  if (!jfid) {
    await updateRoundState(rid, 'finish', 'error: Problem not have a judger');
    return;
  }

  const bfids: string[] = [];
  for (const bid of rd.bids) {
    const bd = await getBotDetail(bid);
    if (!bd) {
      await updateRoundState(rid, 'finish', `error: bot ${bid} not found`);
      return;
    }

    if (!bd.fid) {
      await updateRoundState(rid, 'finish', `error: bot ${bid} invalid`);
      return;
    }

    bfids.push(bd.fid);
  }

  if (!judger) {
    await updateRoundState(rid, 'finish', `error: judger failed initialization`);
    return;
  }

  let log = '';
  await updateRoundState(rid, 'judging', '');

  await judger(rid, jfid, bfids, (str) => {
    log += str + '\n';
  });

  await updateRoundState(rid, 'finish', log);
};
