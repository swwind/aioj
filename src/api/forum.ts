import { CommentDetail, PostDetail, RegionDetail } from '../../app/types';
import { makeDELETERequest, makeGETRequest, makePOSTRequest } from './utils';

export async function getRegions() {
  return await makeGETRequest<{ regions: RegionDetail[]; }>('/regions');
}

export async function getPostsList(region: string) {
  return await makeGETRequest<{ region: RegionDetail; posts: PostDetail[]; }>(`/r/${region}`);
}

export async function getPostDetail(region: string, post: string) {
  return await makeGETRequest<{ post: PostDetail; comments: CommentDetail[]; region: RegionDetail; }>(`/r/${region}/${post}`);
}

export async function sendReply(region: string, post: string, content: string) {
  return await makePOSTRequest<{ cid: string }>(`/r/${region}/${post}/comment`, {
    content,
  });
}

export async function createPost(region: string, title: string, content: string) {
  return await makePOSTRequest<{ pid: string }>(`/r/${region}/post`, {
    title,
    content,
  });
}

export async function createRegion(region: string, title: string, description: string) {
  return await makePOSTRequest(`/r/${region}`, {
    title,
    description,
  });
}

export async function deleteRegion(region: string) {
  return await makeDELETERequest(`/r/${region}`);
}

export async function deletePost(region: string, pid: string) {
  return await makeDELETERequest(`/r/${region}/${pid}`);
}

export async function deleteComment(region: string, pid: string, cid: string) {
  return await makeDELETERequest(`/r/${region}/${pid}/${cid}`);
}
