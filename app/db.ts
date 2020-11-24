import mongodb from 'mongodb';
import config from '../config.json';

const client = new mongodb.MongoClient(config.mongo.url);
await client.connect();
const db = client.db(config.mongo.dbname);

export const configs = db.collection<ConfigData>('config');
export const users = db.collection<UserData>('user');
export const regions = db.collection<RegionData>('region');
export const posts = db.collection<PostData>('post');
export const comments = db.collection<CommentData>('comment');
export const problems = db.collection<ProblemData>('problem');
export const files = db.collection<FileData>('file');

// initialize db
if (!await configs.findOne({ })) {
  configs.insertOne({ maxpid: 1000 });
}

export type ConfigData = {
  maxpid: number; // max problem id
}

export type UserDetail = {
  username: string;
  description: string;
  email: string; // for gravatar
  admin: boolean;
}

export type UserData = {
  password: string;
  friends: string[];
} & UserDetail;

export type RegionDetail = {
  region: string;
  title: string;
  description: string;
}

export type RegionData = {
  maxpid: number; // for counting
} & RegionDetail;

export type PostDetail = {
  pid: number;
  title: string;
  author: string;
  date: number;
}

export type PostData = {
  region: string;
  maxcid: number; // for counting
} & PostDetail;

export type CommentDetail = {
  cid: number;
  author: string;
  edited: boolean;
  content: string;
  date: number;
}

export type CommentData = {
  pid: number;
  region: string;
} & CommentDetail;

export type ProblemDetail = {
  pid: number;
  title: string;
  author: string;
  content: string;
}

export type ProblemData = {
  judger: string;
} & ProblemDetail;

export type FileDetail = {
  uploader: string;
  size: number;
  filename: string;
  fid: string;
  date: number;
}

export type FileData = {
  filepath: string;
} & FileDetail;

export function extractUserDetail(ud: UserData): UserDetail {
  return {
    username: ud.username,
    description: ud.description,
    email: ud.email,
    admin: ud.admin,
  }
}
export function extractRegionDetail(rd: RegionData): RegionDetail {
  return {
    region: rd.region,
    title: rd.title,
    description: rd.description,
  }
}
export function extractPostDetail(pd: PostData): PostDetail {
  return {
    pid: pd.pid,
    title: pd.title,
    author: pd.author,
    date: pd.date,
  }
}
export function extractCommentDetail(cd: CommentData): CommentDetail {
  return {
    cid: cd.cid,
    author: cd.author,
    edited: cd.edited,
    content: cd.content,
    date: cd.date,
  }
}
export function extractFileDetail(fd: FileData): FileDetail {
  return {
    uploader: fd.uploader,
    size: fd.size,
    filename: fd.filename,
    fid: fd.fid,
    date: fd.date,
  }
}