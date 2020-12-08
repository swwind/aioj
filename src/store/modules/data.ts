import { CommentDetail, FileDetail, PostDetail, RegionDetail, UserDetail } from '../../../app/types';
import { Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';

export type State = {
  regions: RegionDetail[];
  region: RegionDetail;
  posts: PostDetail[];
  post: PostDetail;
  comments: CommentDetail[];
  user: UserDetail;
  files: FileDetail[];
}

const state = (): State => ({
  regions: [],
  region: {} as any,
  posts: [],
  post: {} as any,
  comments: [],
  user: {} as any,
  files: [],
});

const mutations: { [key: string]: Mutation<State> } = {
  [MutationTypes.FETCH_USER_DETAIL](state, payload: UserDetail) {
    state.user = payload;
  },
  [MutationTypes.FETCH_REGION_LIST](state, payload: RegionDetail[]) {
    state.regions = payload;
  },
  [MutationTypes.FETCH_POST_LIST](state, payload: PostDetail[]) {
    state.posts = payload;
  },
  [MutationTypes.FETCH_REGION_DETAIL](state, payload: RegionDetail) {
    state.region = payload;
  },
  [MutationTypes.FETCH_POST_DETAIL](state, payload: PostDetail) {
    state.post = payload;
  },
  [MutationTypes.FETCH_COMMENT_LIST](state, payload: CommentDetail[]) {
    state.comments = payload;
  },
  [MutationTypes.FETCH_FILE_LIST](state, payload: FileDetail[]) {
    state.files = payload;
  },
  [MutationTypes.DELETED_REGION](state, payload: string) {
    state.regions = state.regions.filter((s) => s.region !== payload);
  },
  [MutationTypes.DELETED_POST](state, payload: number) {
    state.posts = state.posts.filter((s) => s.pid !== payload);
  },
  [MutationTypes.DELETED_COMMENT](state, payload: number) {
    state.comments = state.comments.filter((s) => s.cid !== payload);
  },
  [MutationTypes.DELETED_FILE](state, payload: string) {
    state.files = state.files.filter((s) => s.fid !== payload);
  },
  [MutationTypes.CREATED_REGION](state, payload: RegionDetail) {
    state.regions = state.regions.concat(payload);
  },
  [MutationTypes.CREATED_POST](state, payload: PostDetail) {
    state.posts = state.posts.concat(payload);
  },
  [MutationTypes.CREATED_COMMENT](state, payload: CommentDetail) {
    state.comments = state.comments.concat(payload);
  },
  [MutationTypes.CREATED_FILE](state, payload: FileDetail) {
    state.files = state.files.concat(payload);
  },
};

export default {
  state,
  mutations,
};
