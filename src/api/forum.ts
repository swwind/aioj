import { CommentDetail, PostDetail, RegionDetail } from 'app/db';
import { makeGETRequest } from './utils';

export async function getRegions() {
  return await makeGETRequest<{ list: RegionDetail[]; }>('/regions');
}

export async function getPostsList(region: string) {
  return await makeGETRequest<RegionDetail & { list: PostDetail[] }>(`/r/${region}`);
}

export async function getPostDetail(region: string, post: string) {
  return await makeGETRequest<PostDetail & { comments: CommentDetail[], region: RegionDetail }>(`/r/${region}/${post}`);
}
