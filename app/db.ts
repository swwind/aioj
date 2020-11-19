import mongodb from 'mongodb';
import config from '../config.json';
import { PASSWORD_WRONG, SERVER_ERROR, USER_EXISTS, USER_NOT_EXISTS } from './errors.js';

const client = new mongodb.MongoClient(config.mongo.url);
await client.connect();
const db = client.db(config.mongo.dbname);
const user = db.collection<UserData>('user');
const problem = db.collection('problem');
const submission = db.collection('submission');

export type UserData = {
  username: string;
  password: string;
}

export async function registerUser(username: string, password: string) {
  const existsUsers = await user.find({
    username,
  }).toArray();
  if (existsUsers.length > 0) {
    return USER_EXISTS;
  }

  const result = await user.insertOne({
    username,
    password,
  });
  if (!result.result.ok) {
    return SERVER_ERROR;
  }

  // passed
}

export async function verifyPassword(username: string, password: string) {
  const result = await user.find({
    username,
  }).toArray();

  if (!result.length) {
    return USER_NOT_EXISTS;
  }
  if (result.length > 1) {
    return SERVER_ERROR;
  }
  if (result[0].password !== password) {
    return PASSWORD_WRONG;
  }

  // passed
}
