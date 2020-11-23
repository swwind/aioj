import { users } from "../db.js";
import { LOGIN_REQUIRE, PASSWORD_WRONG, SERVER_ERROR, USER_EXISTS, USER_NOT_EXISTS } from "../errors.js";
import { Result } from "../utils.js";

export async function registerUser(username: string, password: string): Promise<Result<void, string>> {
  const existsUsers = await users.findOne({
    username,
  });
  if (existsUsers) {
    return Result.error(USER_EXISTS);
  }

  const result = await users.insertOne({
    username,
    password,
    friends: [],
    description: '',
    email: '',
    admin: username === 'root',
  });
  if (!result.result.ok) {
    return Result.error(SERVER_ERROR);
  }

  return Result.ok();
}

export async function verifyPassword(username: string, password: string): Promise<Result<void, string>> {
  const result = await users.findOne({
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

export async function isAdmin(username: string): Promise<Result<boolean, string>> {
  const result = await users.findOne({
    username,
  });
  if (!result) {
    return Result.error(USER_NOT_EXISTS);
  }

  return Result.ok(result.admin);
}

export async function modifyUserDetail(username: string, description: string, email: string): Promise<Result<void, string>> {
  const result = await users.findOneAndUpdate({ username }, { $set: { description, email } });
  if (!result.ok) return Result.error(USER_NOT_EXISTS);
  return Result.ok();
}