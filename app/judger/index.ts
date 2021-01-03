import { getBotDetail } from 'app/db/bots';
import { getProblemDetail } from 'app/db/problems';
import { getRoundDetail, updateRoundState } from 'app/db/rounds';
import { getTmpDir } from 'app/utils';
import { exec } from 'child_process';
import { run } from './judge';

const unzip = (fid: string) => {
  const zip = `uploads/${fid}`;
  return new Promise<string>(async (resolve, reject) => {
    const dirname = await getTmpDir();
    exec(`unzip "${zip}" -d "${dirname}"`, (err) => {
      if (err) reject(err);
      else resolve(dirname);
    });
  });
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

  let data = '';
  await updateRoundState(rid, 'judging', '');

  await createJudger(jfid, bfids, (str) => {
    data += str + '\n';
    console.log(str);
    // TODO: send to ws
  });

  await updateRoundState(rid, 'finish', data);
}

export const createJudger = (jfid: string, bfid: string[], log: (str: string) => void) => {
  return new Promise<Promise<void>>(async (resolve) => {
    resolve(run(await unzip(jfid), await Promise.all(bfid.map((bot) => unzip(bot))), log));
  });
}
