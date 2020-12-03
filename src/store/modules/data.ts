import { CommentDetail, PostDetail, RegionDetail, UserDetail } from '../../../app/types';
import { Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';

export type State = {
  regions: RegionDetail[];
  region: RegionDetail;
  posts: PostDetail[];
  post: PostDetail;
  comments: CommentDetail[];
  user: UserDetail;
}

const state = (): State => ({
  regions: [],
  region: {} as any,
  posts: [],
  post: {} as any,
  comments: [],
  user: {} as any,
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
};

export default {
  state,
  mutations,
};
