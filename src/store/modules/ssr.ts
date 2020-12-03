import { Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';

export type State = {
  status: number;
  title: string;
  meta: Record<string, string>;
}

const state = (): State => ({
  status: 200,
  title: '',
  meta: {},
});

const mutations: { [key: string]: Mutation<State> } = {
  [MutationTypes.CHANGE_SSR_STATUS](state, payload: number) {
    state.status = payload;
  },
  [MutationTypes.CHANGE_SSR_TITLE](state, payload: string) {
    if (typeof global.document !== 'undefined') {
      document.title = payload;
    }
    state.title = payload;
  },
  [MutationTypes.CHANGE_SSR_META](state, payload: Record<string, string>) {
    state.meta = payload;
  },
};

export default {
  state,
  mutations,
};
