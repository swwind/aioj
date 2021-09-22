import { bots, counter, extractBotDetail } from '../db';
import { SERVER_ERROR } from '../errors';

export async function createNewBot(username: string, name: string, description: string, fid: string, pid: number): Promise<number> {
  const counts = await counter.findOneAndUpdate({ }, { $inc: { maxbid: 1 } });
  if (!counts.value) {
    throw new Error(SERVER_ERROR);
  }
  const bid = counts.value.maxbid;
  const time = Date.now();
  await bots.insertOne({
    name,
    fid,
    pid,
    version: 1,
    description,
    author: username,
    bid,
    created: time,
    updated: time,
  });
  return bid;
}

export async function modifyBot(bid: number, name: string, description: string, fid: string) {
  await bots.findOneAndUpdate({ bid }, { $set: { name, description, fid, updated: Date.now() }, $inc: { version: 1 } });
}

export async function modifyBotInfo(bid: number, name: string, description: string) {
  await bots.findOneAndUpdate({ bid }, { $set: { name, description, updated: Date.now() }, $inc: { version: 1 } });
}

export async function getBotsDetail(bids: number[]) {
  const result = await bots.find({ bid: { $in: bids } }).toArray();
  return result.map((bot) => extractBotDetail(bot));
}

export async function getBotDetail(bid: number) {
  const bot = await bots.findOne({ bid });
  return bot && extractBotDetail(bot);
}

export async function getBotList(pid?: number, username?: string) {
  const ask: { pid?: number, author?: string } = {};
  if (pid !== undefined) {
    ask.pid = pid;
  }
  if (username !== undefined) {
    ask.author = username;
  }

  const bot = await bots.find(ask).toArray();
  return bot.map(extractBotDetail);
}
