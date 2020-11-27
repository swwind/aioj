import { PostDetail, RegionDetail } from 'app/db';
import { Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';

const state = {
  regionList: [] as RegionDetail[],
  postList: [] as PostDetail[],
};

const mutations: { [key: string]: Mutation<typeof state> } = {
  [MutationTypes.UPDATE_REGIONS_LIST](state, payload: RegionDetail[]) {
    state.regionList = payload;
  },
  [MutationTypes.UPDATE_POSTS_LIST](state, payload: PostDetail[]) {
    state.postList = payload;
  },
};

export default {
  state,
  mutations,
};

export type State = typeof state;
