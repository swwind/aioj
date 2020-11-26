import { CommentDetail, comments, PostDetail, posts, RegionDetail, regions, extractCommentDetail, extractPostDetail, extractRegionDetail } from "../db";
import { COMMENT_NOT_EXISTS, POST_NOT_EXISTS, REGION_ALREADY_EXISTS, REGION_NOT_EXISTS } from "../errors";
import { Result } from "../utils";

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
  const result = await regions.findOneAndUpdate({ region }, { $set: { title, description } });
  if (!result.ok) return Result.error(REGION_NOT_EXISTS);
  return Result.ok();
}

export async function modifyPost(region: string, pid: number, title: string): Promise<Result<void, string>> {
  const result = await posts.findOneAndUpdate({ region, pid }, { $set: { title } });
  if (!result.ok) return Result.error(POST_NOT_EXISTS);
  return Result.ok();
}

export async function modifyComment(region: string, pid: number, cid: number, content: string): Promise<Result<void, string>> {
  const result = await comments.findOneAndUpdate({ region, pid, cid }, { $set: { content, edited: true } });
  if (!result.ok) return Result.error(COMMENT_NOT_EXISTS);
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

export async function getPostDetail(region: string, pid: number): Promise<Result<PostDetail, string>> {
  const res = await posts.findOne({ region, pid });
  if (!res) return Result.error(POST_NOT_EXISTS);
  return Result.ok(extractPostDetail(res));
}

export async function getCommentDetail(region: string, pid: number, cid: number): Promise<Result<CommentDetail, string>> {
  const res = await comments.findOne({ region, pid, cid });
  if (!res) return Result.error(COMMENT_NOT_EXISTS);
  return Result.ok(extractCommentDetail(res));
}

export async function getPostComments(region: string, pid: number): Promise<CommentDetail[]> {
  return (await comments.find({ region, pid }).toArray()).map(extractCommentDetail);
}

export async function getPostsList(region: string): Promise<PostDetail[]> {
  return (await posts.find({ region }).toArray()).map(extractPostDetail);
}

export async function getRegionsList(): Promise<RegionDetail[]> {
  return (await regions.find({ }).toArray()).map(extractRegionDetail);
}
