import { UserDetail } from '../../../app/types';
import { Action, Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';
import { ActionTypes } from '..';
import { API } from '@/api';
import { Ref } from 'vue';

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
  },
  async [ActionTypes.LOGOUT]({ commit, dispatch }) {
    const result = await API.logoutAttempt();
    if (result.status === 200) {
      commit(MutationTypes.LOGOUT);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.ADD_FRIEND]({ commit, dispatch }, username: string) {
    const result = await API.addFriend(username);
    if (result.status === 200) {
      commit(MutationTypes.ADD_NEW_FRIEND, username);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.REMOVE_FRIEND]({ commit, dispatch }, username: string) {
    const result = await API.removeFriend(username);
    if (result.status === 200) {
      commit(MutationTypes.REMOVE_FRIEND, username);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.LOGIN]({ commit, dispatch }, payload: {
    username: Ref<string>;
    password: Ref<string>;
    redirect: string;
  }) {
    const result = await API.loginAttempt(payload.username.value, payload.password.value);
    if (result.status === 200) {
      commit(MutationTypes.LOGIN, result.user);
      await dispatch(ActionTypes.FETCH_FRIEND_DATA);
      dispatch(ActionTypes.ROUTER_PUSH, payload.redirect);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.REGISTER]({ commit, dispatch }, payload: {
    username: Ref<string>;
    password: Ref<string>;
    redirect: string;
  }) {
    const result = await API.registerAttempt(payload.username.value, payload.password.value);
    if (result.status === 200) {
      commit(MutationTypes.LOGIN, result.user);
      dispatch(ActionTypes.ROUTER_PUSH, payload.redirect);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
}

export default {
  state,
  mutations,
  actions,
};
