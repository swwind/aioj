import { languages } from '@/i18n';
import { Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';

export type State = {
  lang: keyof typeof languages;
}

const state = (): State => ({
  lang: 'en_us',
});

const mutations: { [key: string]: Mutation<State> } = {
  [MutationTypes.UPDATE_LANGUAGE](state, payload: keyof typeof languages) {
    state.lang = payload;
  },
};

export default {
  state,
  mutations,
};
