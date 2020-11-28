import { languages } from '@/i18n';
import { Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';

const state = {
  lang: 'en_us' as keyof typeof languages,
};

const mutations: { [key: string]: Mutation<typeof state> } = {
  [MutationTypes.UPDATE_LANGUAGE](state, payload: keyof typeof languages) {
    state.lang = payload;
  },
};

export default {
  state,
  mutations,
};

export type State = typeof state;
