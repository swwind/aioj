import mongodb from 'mongodb';
import config from '../config.json';

const client = new mongodb.MongoClient(config.mongo.url);
await client.connect();
const db = client.db(config.mongo.dbname);

export const users = db.collection<UserData>('user');
export const regions = db.collection<RegionData>('region');
export const posts = db.collection<PostData>('post');
export const comments = db.collection<CommentData>('comment');

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

export function extractUserDetail(userdata: UserData): UserDetail {
  return {
    username: userdata.username,
    description: userdata.description,
    email: userdata.email,
    admin: userdata.admin,
  }
}
export function extractRegionDetail(regiondata: RegionData): RegionDetail {
  return {
    region: regiondata.region,
    title: regiondata.title,
    description: regiondata.description,
  }
}
export function extractPostDetail(postdata: PostData): PostDetail {
  return {
    pid: postdata.pid,
    title: postdata.title,
    author: postdata.author,
    date: postdata.date,
  }
}
export function extractCommentDetail(commentdata: CommentData): CommentDetail {
  return {
    cid: commentdata.cid,
    author: commentdata.author,
    edited: commentdata.edited,
    content: commentdata.content,
    date: commentdata.date,
  }
}