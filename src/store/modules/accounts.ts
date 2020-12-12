import { UserDetail } from '../../../app/types';
import { Action, Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';
import { ActionTypes } from '..';
import { API } from '@/api';

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

const actions: { [key: string]: Action<State, any> } = {
  async [ActionTypes.FETCH_ACCOUNT_DATA]({ commit, dispatch }) {
    const result = await API.whoami();
    if (result.status === 200) {
      commit(MutationTypes.LOGIN, result.user);
      await dispatch(ActionTypes.FETCH_FRIEND_DATA);
    }
  },
  async [ActionTypes.FETCH_FRIEND_DATA]({ commit, dispatch }) {
    const result = await API.getMyFriends();
    if (result.status === 200) {
      commit(MutationTypes.FETCH_USER_FRIENDS, result.friends);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  }
}

export default {
  state,
  mutations,
  actions,
};
