import { CommentDetail, PostDetail, RegionDetail } from '../../app/types';
import { APICore } from './utils';

export const createForumAPI = (api: APICore) => {
  const { makeDELETERequest, makeGETRequest, makePOSTRequest, makePUTRequest } = api;

  return {
    getRegions() {
      return makeGETRequest<{ regions: RegionDetail[]; }>('/regions');
    },

    getPostsList(region: string) {
      return makeGETRequest<{ region: RegionDetail; posts: PostDetail[]; }>(`/r/${region}`);
    },

    getPostDetail(region: string, pid: number) {
      return makeGETRequest<{ post: PostDetail; comments: CommentDetail[]; region: RegionDetail; }>(`/r/${region}/${pid}`);
    },

    sendReply(region: string, pid: number, content: string, markdown: boolean) {
      return makePOSTRequest<{ comment: CommentDetail }>(`/r/${region}/${pid}/comment`, {
        content,
        markdown,
      });
    },

    createPost(region: string, title: string, content: string, markdown: boolean) {
      return makePOSTRequest<{ pid: number }>(`/r/${region}/post`, {
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

    deletePost(region: string, pid: number) {
      return makeDELETERequest(`/r/${region}/${pid}`);
    },

    deleteComment(region: string, pid: number, cid: number) {
      return makeDELETERequest(`/r/${region}/${pid}/${cid}`);
    },

    modifyComment(region: string, pid: number, cid: number, content: string) {
      return makePUTRequest(`/r/${region}/${pid}/${cid}`, {
        content,
      });
    },

    modifyRegion(region: string, title: string, description: string) {
      return makePUTRequest(`/r/${region}`, {
        title,
        description,
      });
    },
  };
};
