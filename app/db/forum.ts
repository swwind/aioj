import { CommentData, comments, PostData, posts, RegionData, regions } from "../db.js";
import { COMMENT_NOT_EXISTS, POST_NOT_EXISTS, REGION_ALREADY_EXISTS, REGION_NOT_EXISTS } from "../errors.js";
import { Result } from "../utils.js";

export async function createRegion(region: string, title: string, description: string): Promise<Result<void, string>> {

  const res = await regions.findOne({
    region,
  });
  if (res) return Result.error(REGION_ALREADY_EXISTS);

  await regions.insertOne({
    region,
    title,
    description,
    maxpid: 0,
  });

  return Result.ok();
}

export async function createPost(region: string, title: string, author: string, content: string): Promise<Result<number, string>> {
  const res = await regions.findOne({
    region,
  });
  if (!res) {
    return Result.error(REGION_NOT_EXISTS);
  }

  const pid = res.maxpid + 1;
  await regions.updateOne(res, { $set: { maxpid: pid } });

  const date = Date.now();

  await posts.insertOne({
    pid,
    title,
    author,
    date,
    region,
    maxcid: 1,
  });
  
  await comments.insertOne({
    cid: 1,
    author,
    edited: false,
    content,
    date,
    pid,
    region,
  });

  return Result.ok(pid);
}

export async function createComment(region: string, pid: number, author: string, content: string): Promise<Result<number, string>> {

  const res = await posts.findOne({
    region,
    pid,
  });
  if (!res) return Result.error(POST_NOT_EXISTS);

  const cid = res.maxcid + 1;
  await posts.updateOne(res, { $set: { maxcid: cid } });

  await comments.insertOne({
    cid,
    author,
    edited: false,
    content,
    date: Date.now(),
    pid,
    region,
  });

  return Result.ok(cid);
}

export async function modifyRegion(region: string, title: string, description: string): Promise<Result<void, string>> {
  const res = await regions.findOne({ region });
  if (!res) return Result.error(REGION_NOT_EXISTS);

  await regions.updateOne(res, { $set: { title, description } });

  return Result.ok();
}

export async function modifyPost(region: string, pid: number, title: string): Promise<Result<void, string>> {
  const res = await posts.findOne({ region, pid });
  if (!res) return Result.error(POST_NOT_EXISTS);

  await posts.updateOne(res, { $set: { title } });

  return Result.ok();
}

export async function modifyComment(region: string, pid: number, cid: number, content: string): Promise<Result<void, string>> {
  const res = await comments.findOne({ region, pid, cid });
  if (!res) return Result.error(COMMENT_NOT_EXISTS);

  await comments.updateOne(res, { $set: { content, edited: true } });

  return Result.ok();
}

export async function deleteRegion(region: string): Promise<Result<void, string>> {
  const res = await regions.findOne({ region });
  if (!res) return Result.error(REGION_NOT_EXISTS);

  await regions.deleteMany({ region });
  await posts.deleteMany({ region });
  await comments.deleteMany({ region });

  return Result.ok();
}

export async function deletePost(region: string, pid: number): Promise<Result<void, string>> {
  const res = await posts.findOne({ region, pid });
  if (!res) return Result.error(POST_NOT_EXISTS);

  await posts.deleteMany({ region, pid });
  await comments.deleteMany({ region, pid });

  return Result.ok();
}

export async function deleteComment(region: string, pid: number, cid: number): Promise<Result<void, string>> {
  const res = await comments.findOne({ region, pid, cid });
  if (!res) return Result.error(POST_NOT_EXISTS);

  await comments.deleteOne({ region, pid, cid });

  return Result.ok();
}

export async function getPostDetail(region: string, pid: number): Promise<Result<PostData, string>> {
  const res = await posts.findOne({ region, pid });
  if (!res) return Result.error(POST_NOT_EXISTS);
  return Result.ok(res);
}

export async function getCommentDetail(region: string, pid: number, cid: number): Promise<Result<CommentData, string>> {
  const res = await comments.findOne({ region, pid, cid });
  if (!res) return Result.error(COMMENT_NOT_EXISTS);
  return Result.ok(res);
}

export async function getPostComments(region: string, pid: number): Promise<CommentData[]> {
  return await comments.find({ region, pid }).toArray();
}

export async function getPostsList(region: string): Promise<PostData[]> {
  return await posts.find({ region }).toArray();
}

export async function getRegionsList(): Promise<RegionData[]> {
  return await regions.find({ }).toArray();
}
