import mongodb from 'mongodb';
import config from '../config.json';

const client = new mongodb.MongoClient(config.mongo.url);
await client.connect();
const db = client.db(config.mongo.dbname);

export const users = db.collection<UserData>('user');
export const regions = db.collection<RegionData>('region');
export const posts = db.collection<PostData>('post');
export const comments = db.collection<CommentData>('comment');

export type UserData = {
  username: string;
  password: string;
  friends: string[];
  description: string;
  email: string; // for gravatar
  admin: boolean;
}

export type RegionData = {
  region: string;
  title: string;
  description: string;

  maxpid: number; // for counting
}

export type PostData = {
  pid: number;
  title: string;
  author: string;
  date: number;
  
  region: string;
  maxcid: number; // for counting
}

export type CommentData = {
  cid: number;
  author: string;
  edited: boolean;
  content: string;
  date: number;

  pid: number;
  region: string;
}
