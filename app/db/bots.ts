import { bots, counter, extractBotDetail } from 'app/db';
import { SERVER_ERROR } from 'app/errors';

export async function createNewBot(username: string, name: string, description: string, fid: string, pid: number): Promise<number> {
  const counts = await counter.findOneAndUpdate({ }, { $inc: { maxbid: 1 } });
  if (!counts.value) {
    throw new Error(SERVER_ERROR);
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
  return bid;
}

export async function modifyBot(bid: number, name: string, description: string, fid: string) {
  const bot = await bots.findOneAndUpdate({ bid }, { $set: { name, description, fid }, $inc: { version: 1 } });
  if (!bot.ok || !bot.value) throw new Error('mongodb fucked');
  return extractBotDetail(bot.value);
}

export async function getBotDetail(bid: number) {
  const bot = await bots.findOne({ bid });
  return bot && extractBotDetail(bot);
}

export async function getBotList(pid?: number, username?: string) {
  const ask: { pid?: number, username?: string } = {};
  if (pid !== undefined) {
    ask.pid = pid;
  }
  if (username !== undefined) {
    ask.username = username;
  }

  const bot = await bots.find(ask).toArray();
  return bot.map(extractBotDetail);
}
