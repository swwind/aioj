import { UserDetail } from '../../../app/types';
import { Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';

const state = {
  username: '',
  admin: false,
};

const mutations: { [key: string]: Mutation<typeof state> } = {
  [MutationTypes.LOGIN](state, payload: UserDetail) {
    state.username = payload.username;
    state.admin = payload.admin;
  },
  [MutationTypes.LOGOUT](state) {
    state.username = '';
    state.admin = false;
  },
};

export default {
  state,
  mutations,
};

export type State = typeof state;
