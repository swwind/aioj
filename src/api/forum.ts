import { CommentDetail, PostDetail, RegionDetail } from "app/db";
import { makeGETRequest } from "./utils";

export async function getRegions() {
  return await makeGETRequest<{ list: RegionDetail[]; }>('/regions');
}

export async function getRegionDetail(region: string) {
  return await makeGETRequest<{ list: PostDetail[] }>(`/r/${region}`);
}

export async function getPostDetail(region: string, post: string) {
  return await makeGETRequest<{ list: (PostDetail & { comments: CommentDetail[] })[] }>(`/r/${region}/${post}`);
}
