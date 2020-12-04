import { UserDetail } from '../../../app/types';
import { Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';

export type State = {
  username: string;
  friends: string[];
  admin: boolean;
}

const state = (): State => ({
  username: '',
  friends: [],
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
  [MutationTypes.FETCH_USER_FRIENDS](state, payload: string[]) {
    state.friends = payload;
  },
  [MutationTypes.ADD_NEW_FRIEND](state, payload: string) {
    state.friends.push(payload);
  },
  [MutationTypes.REMOVE_FRIEND](state, payload: string) {
    state.friends = state.friends.filter((s) => s !== payload);
  },
};

export default {
  state,
  mutations,
};
