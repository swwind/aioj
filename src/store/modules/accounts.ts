import { UserDetail } from '../../../app/types';
import { Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';

export type State = {
  username: string;
  admin: boolean;
}

const state = (): State => ({
  username: '',
  admin: false,
});

const mutations: { [key: string]: Mutation<State> } = {
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
