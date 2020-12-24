import { CommentDetail, PostDetail, RegionDetail } from '../../app/types';
import { APICore } from './utils';

export const createForumAPI = (api: APICore) => {
  const { makeDELETERequest, makeGETRequest, makePOSTRequest } = api;

  return {
    getRegions() {
      return makeGETRequest<{ regions: RegionDetail[]; }>('/regions');
    },

    getPostsList(region: string) {
      return makeGETRequest<{ region: RegionDetail; posts: PostDetail[]; }>(`/r/${region}`);
    },

    getPostDetail(region: string, post: string) {
      return makeGETRequest<{ post: PostDetail; comments: CommentDetail[]; region: RegionDetail; }>(`/r/${region}/${post}`);
    },

    sendReply(region: string, post: string, content: string, markdown: boolean) {
      return makePOSTRequest<{ comment: CommentDetail }>(`/r/${region}/${post}/comment`, {
        content,
        markdown,
      });
    },

    createPost(region: string, title: string, content: string, markdown: boolean) {
      return makePOSTRequest<{ pid: string }>(`/r/${region}/post`, {
        title,
        content,
        markdown,
      });
    },

    createRegion(region: string, title: string, description: string) {
      return makePOSTRequest(`/r/${region}`, {
        title,
        description,
      });
    },

    deleteRegion(region: string) {
      return makeDELETERequest(`/r/${region}`);
    },

    deletePost(region: string, pid: string) {
      return makeDELETERequest(`/r/${region}/${pid}`);
    },

    deleteComment(region: string, pid: string, cid: string) {
      return makeDELETERequest(`/r/${region}/${pid}/${cid}`);
    },
  };
};
