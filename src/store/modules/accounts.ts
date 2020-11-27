import { Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';

const state = {
  username: '',
};

const mutations: { [key: string]: Mutation<typeof state> } = {
  [MutationTypes.LOGIN](state, payload: string) {
    state.username = payload;
  },
  [MutationTypes.LOGOUT](state) {
    state.username = '';
  },
};

export default {
  state,
  mutations,
};

export type State = typeof state;
