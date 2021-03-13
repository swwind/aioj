import { UserDetail } from '../../../app/types';
import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';
import { ArgumentedActionContext } from '..';
import { Argument, Arguments, unwarpArguments } from '../../utils';
import { unref } from 'vue';
import { API } from '../../api';

export type State = {
  username: string;
  friends: string[];
  admin: boolean;
}

export type Mutations<S = State> = {
  [MutationTypes.LOGIN](state: S, payload: UserDetail): void;
  [MutationTypes.LOGOUT](state: S): void;
  [MutationTypes.FETCH_USER_FRIENDS](state: S, payload: string[]): void;
  [MutationTypes.ADD_NEW_FRIEND](state: S, payload: string): void;
  [MutationTypes.REMOVE_FRIEND](state: S, payload: string): void;
}

export type Actions<S = State> = {
  [ActionTypes.FETCH_ACCOUNT_DATA](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.FETCH_FRIEND_DATA](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.LOGOUT](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.ADD_FRIEND](actx: ArgumentedActionContext<S>, username: Argument<string>): Promise<void>;
  [ActionTypes.REMOVE_FRIEND](actx: ArgumentedActionContext<S>, username: Argument<string>): Promise<void>;
  [ActionTypes.LOGIN](actx: ArgumentedActionContext<S>, payload: Arguments<{
    username: string;
    password: string;
    redirect: string;
  }>): Promise<void>;
  [ActionTypes.REGISTER](actx: ArgumentedActionContext<S>, payload: Arguments<{
    username: string;
    password: string;
    redirect: string;
  }>): Promise<void>;
}

export const createAccountsModule = (api: API) => {
  const state = (): State => ({
    username: '',
    friends: [],
    admin: false,
  });

  const mutations: Mutations = {
    [MutationTypes.LOGIN](state, payload) {
      state.username = payload.username;
      state.admin = payload.admin;
    },
    [MutationTypes.LOGOUT](state) {
      state.username = '';
      state.admin = false;
    },
    [MutationTypes.FETCH_USER_FRIENDS](state, payload) {
      state.friends = payload;
    },
    [MutationTypes.ADD_NEW_FRIEND](state, payload) {
      state.friends.push(payload);
    },
    [MutationTypes.REMOVE_FRIEND](state, payload) {
      state.friends = state.friends.filter((s) => s !== payload);
    },
  };

  const actions: Actions = {
    async [ActionTypes.FETCH_ACCOUNT_DATA]({ commit, dispatch }) {
      const result = await api.whoami();
      if (result.status === 200) {
        commit(MutationTypes.LOGIN, result.user);
        await dispatch(ActionTypes.FETCH_FRIEND_DATA);
      }
    },
    async [ActionTypes.FETCH_FRIEND_DATA]({ commit, dispatch }) {
      const result = await api.getMyFriends();
      if (result.status === 200) {
        commit(MutationTypes.FETCH_USER_FRIENDS, result.friends);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.LOGOUT]({ commit, dispatch }) {
      const result = await api.logoutAttempt();
      if (result.status === 200) {
        commit(MutationTypes.LOGOUT);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.ADD_FRIEND]({ commit, dispatch }, payload) {
      const username = unref(payload);
      const result = await api.addFriend(username);
      if (result.status === 200) {
        commit(MutationTypes.ADD_NEW_FRIEND, username);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.REMOVE_FRIEND]({ commit, dispatch }, payload) {
      const username = unref(payload);
      const result = await api.removeFriend(username);
      if (result.status === 200) {
        commit(MutationTypes.REMOVE_FRIEND, username);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.LOGIN]({ commit, dispatch }, payload) {
      const { username, password, redirect } = unwarpArguments(payload);
      const result = await api.loginAttempt(username, password);
      if (result.status === 200) {
        commit(MutationTypes.LOGIN, result.user);
        await dispatch(ActionTypes.FETCH_FRIEND_DATA);
        dispatch(ActionTypes.ROUTER_PUSH, redirect);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.REGISTER]({ commit, dispatch }, payload) {
      const { username, password, redirect } = unwarpArguments(payload);
      const result = await api.registerAttempt(username, password);
      if (result.status === 200) {
        commit(MutationTypes.LOGIN, result.user);
        dispatch(ActionTypes.ROUTER_PUSH, redirect);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
  };

  return {
    state,
    mutations,
    actions,
  };
};
