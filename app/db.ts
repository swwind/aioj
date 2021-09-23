import mongodb from 'mongodb';
const { MongoClient } = mongodb;
import config from '../config.json';
import { AuthData, BotData, BotDetail, BotRecentRoundData, CommentData, CommentDetail, CounterData, FileData, FileDetail, PostData, PostDetail, ProblemAbstract, ProblemData, ProblemDetail, RegionData, RegionDetail, RoundData, RoundDetail, UserData, UserDetail } from './types';

const client = new MongoClient(config.mongo.url, { useUnifiedTopology: true });
await client.connect();
const db = client.db(config.mongo.dbname);

export const counter = db.collection<CounterData>('counter');
export const users = db.collection<UserData>('user');
export const regions = db.collection<RegionData>('region');
export const posts = db.collection<PostData>('post');
export const comments = db.collection<CommentData>('comment');
export const problems = db.collection<ProblemData>('problem');
export const files = db.collection<FileData>('file');
export const auths = db.collection<AuthData>('auth');
export const bots = db.collection<BotData>('bots');
export const rounds = db.collection<RoundData>('rounds');
export const bot_rounds = db.collection<BotRecentRoundData>('bot_rounds');

// initialize db
if (!await counter.findOne({ })) {
  counter.insertOne({ maxpid: 1000, maxbid: 1, maxrid: 1 });
}

export function extractUserDetail(ud: UserData): UserDetail {
  return {
    username: ud.username,
    description: ud.description,
    email: ud.email,
    admin: ud.admin,
  };
}
export function extractRegionDetail(rd: RegionData): RegionDetail {
  return {
    region: rd.region,
    title: rd.title,
    description: rd.description,
  };
}
export function extractPostDetail(pd: PostData): PostDetail {
  return {
    pid: pd.pid,
    title: pd.title,
    author: pd.author,
    date: pd.date,
  };
}
export function extractCommentDetail(cd: CommentData): CommentDetail {
  return {
    cid: cd.cid,
    author: cd.author,
    edited: cd.edited,
    content: cd.content,
    date: cd.date,
    markdown: cd.markdown,
  };
}
export function extractFileDetail(fd: FileData): FileDetail {
  return {
    uploader: fd.uploader,
    size: fd.size,
    filename: fd.filename,
    fid: fd.fid,
    date: fd.date,
  };
}
export function extractProblemDetail(pd: ProblemData): ProblemDetail {
  return {
    author: pd.author,
    pid: pd.pid,
    title: pd.title,
    content: pd.content,
    date: pd.date,
    hidden: pd.hidden,
    fid: pd.fid,
    paint: pd.paint,
    playerMax: pd.playerMax,
    playerMin: pd.playerMin,
  };
}
export function extractProblemAbstract(pd: ProblemData): ProblemAbstract {
  return {
    pid: pd.pid,
    title: pd.title,
  };
}

export function extractBotDetail(bd: BotData): BotDetail {
  return {
    fid: bd.fid,
    version: bd.version,
    name: bd.name,
    description: bd.description,
    author: bd.author,
    pid: bd.pid,
    bid: bd.bid,
    created: bd.created,
    updated: bd.updated,
  };
}
export function extractRoundDetail(rd: RoundData): RoundDetail {
  return {
    log: rd.log,
    pid: rd.pid,
    bids: rd.bids,
    rid: rd.rid,
    status: rd.status,
  };
}

export function extractBotRecentRoundData(brr: BotRecentRoundData): BotRecentRoundData {
  return {
    bid: brr.bid,
    rid: brr.rid,
    pid: brr.pid,
    is_winner: brr.is_winner,
  }
}
