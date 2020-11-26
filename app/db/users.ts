import { UserDetail, users, extractUserDetail } from "../db";
import { USER_NOT_EXISTS } from "../errors";
import { Result } from "../utils";

export async function modifyUserDetail(username: string, description: string, email: string): Promise<Result<void, string>> {
  const result = await users.findOneAndUpdate({ username }, { $set: { description, email } });
  if (!result.ok) return Result.error(USER_NOT_EXISTS);
  return Result.ok();
}

export async function getUserDetail(username: string): Promise<Result<UserDetail, string>> {
  const result = await users.findOne({ username });
  if (!result) return Result.error(USER_NOT_EXISTS);
  return Result.ok(extractUserDetail(result));
}
