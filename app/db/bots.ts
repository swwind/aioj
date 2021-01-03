import { bots, counter, extractBotDetail } from 'app/db';
import { SERVER_ERROR } from 'app/errors';
import { Result } from 'app/utils';

export async function createNewBot(username: string, name: string, description: string, fid: string, pid: number): Promise<Result<number, string>> {
  const counts = await counter.findOneAndUpdate({ }, { $inc: { maxbid: 1 } });
  if (!counts.value) {
    return Result.error(SERVER_ERROR);
  }
  const bid = counts.value.maxbid;
  await bots.insertOne({
    name,
    fid,
    pid,
    version: 1,
    description,
    author: username,
    bid,
  });
  return Result.ok(bid);
}

export async function modifyBot(bid: number, name: string, description: string, fid: string) {
  await bots.findOneAndUpdate({ bid }, { $set: { name, description, fid }, $inc: { version: 1 } });
}

export async function getBotDetail(bid: number) {
  const bot = await bots.findOne({ bid });
  return bot && extractBotDetail(bot);
}
