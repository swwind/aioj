import mongodb, { ResumeToken } from 'mongodb';
import config from '../config.json';
import { FRIEND_ALREADY_EXISTS, FRIEND_NOT_EXISTS, PASSWORD_WRONG, SERVER_ERROR, USER_EXISTS, USER_NOT_EXISTS } from './errors.js';
import { neq, Result } from './utils.js';

const client = new mongodb.MongoClient(config.mongo.url);
await client.connect();
const db = client.db(config.mongo.dbname);
const user = db.collection<UserData>('user');
const problem = db.collection('problem');
const submission = db.collection('submission');

export type UserData = {
  username: string;
  password: string;
  friends: string[];
}

export async function registerUser(username: string, password: string): Promise<Result<void, string>> {
  const existsUsers = await user.findOne({
    username,
  });
  if (existsUsers) {
    return Result.error(USER_EXISTS);
  }

  const result = await user.insertOne({
    username,
    password,
    friends: [],
  });
  if (!result.result.ok) {
    return Result.error(SERVER_ERROR);
  }

  return Result.ok();
}

export async function verifyPassword(username: string, password: string): Promise<Result<void, string>> {
  const result = await user.findOne({
    username,
  });

  if (!result) {
    return Result.error(USER_NOT_EXISTS);
  }
  if (result.password !== password) {
    return Result.error(PASSWORD_WRONG);
  }

  return Result.ok();
}

export async function getFriendsList(username: string): Promise<Result<string[], string>> {
  const result = await user.findOne({
    username,
  });

  if (!result) {
    return Result.error(USER_NOT_EXISTS);
  }

  return Result.ok(result.friends);
}

export async function addNewFriend(myname: string, friendname: string): Promise<Result<void, string>> {
  const me = await user.findOne({ username: myname });
  const fd = await user.findOne({ username: friendname });
  if (!me || !fd) {
    return Result.error(USER_NOT_EXISTS);
  }

  if (me.friends.indexOf(friendname) > -1) {
    return Result.error(FRIEND_ALREADY_EXISTS);
  }

  const updres1 = await user.updateOne({ username: myname }, { $set: { friends: me.friends.concat(friendname) } });
  const updres2 = await user.updateOne({ username: friendname }, { $set: { friends: fd.friends.concat(myname) } });
  if (!updres1.result.ok || !updres2.result.ok) {
    return Result.error(SERVER_ERROR);
  }

  return Result.ok();
}

export async function deleteOldFriend(myname: string, friendname: string): Promise<Result<void, string>> {
  const me = await user.findOne({ username: myname });
  const fd = await user.findOne({ username: friendname });
  if (!me || !fd) {
    return Result.error(USER_NOT_EXISTS);
  }

  if (me.friends.indexOf(friendname) === -1 || fd.friends.indexOf(myname) === -1) {
    return Result.error(FRIEND_NOT_EXISTS);
  }

  const updres1 = await user.updateOne({ username: myname }, { $set: { friends: me.friends.filter(neq(friendname)) } });
  const updres2 = await user.updateOne({ username: friendname }, { $set: { friends: fd.friends.filter(neq(myname)) } });
  if (!updres1.result.ok || !updres2.result.ok) {
    return Result.error(SERVER_ERROR);
  }

  return Result.ok();
}
