import { users } from "../db";
import { FRIEND_ALREADY_EXISTS, FRIEND_NOT_EXISTS, SERVER_ERROR, USER_NOT_EXISTS } from "../errors";
import { neq, Result } from "../utils";

export async function getFriendsList(username: string): Promise<Result<string[], string>> {
  const result = await users.findOne({ username });

  if (!result) {
    return Result.error(USER_NOT_EXISTS);
  }

  return Result.ok(result.friends);
}

export async function addNewFriend(myname: string, friendname: string): Promise<Result<void, string>> {
  const me = await users.findOne({ username: myname });
  const fd = await users.findOne({ username: friendname });
  if (!me || !fd) {
    return Result.error(USER_NOT_EXISTS);
  }

  if (me.friends.indexOf(friendname) > -1) {
    return Result.error(FRIEND_ALREADY_EXISTS);
  }

  const updres1 = await users.updateOne({ username: myname }, { $set: { friends: me.friends.concat(friendname) } });
  const updres2 = await users.updateOne({ username: friendname }, { $set: { friends: fd.friends.concat(myname) } });
  if (!updres1.result.ok || !updres2.result.ok) {
    return Result.error(SERVER_ERROR);
  }

  return Result.ok();
}

export async function deleteOldFriend(myname: string, friendname: string): Promise<Result<void, string>> {
  const me = await users.findOne({ username: myname });
  const fd = await users.findOne({ username: friendname });
  if (!me || !fd) {
    return Result.error(USER_NOT_EXISTS);
  }

  if (me.friends.indexOf(friendname) === -1 || fd.friends.indexOf(myname) === -1) {
    return Result.error(FRIEND_NOT_EXISTS);
  }

  const updres1 = await users.updateOne({ username: myname }, { $set: { friends: me.friends.filter(neq(friendname)) } });
  const updres2 = await users.updateOne({ username: friendname }, { $set: { friends: fd.friends.filter(neq(myname)) } });
  if (!updres1.result.ok || !updres2.result.ok) {
    return Result.error(SERVER_ERROR);
  }

  return Result.ok();
}
