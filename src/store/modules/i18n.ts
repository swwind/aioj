import { languages } from '@/i18n';
import { MutationTypes } from '../mutation-types';

export type State = {
  lang: keyof typeof languages;
}

export type Mutations<S = State> = {
  [MutationTypes.UPDATE_LANGUAGE](state: S, payload: string): void;
}

export type Actions = { };

const state = (): State => ({
  lang: 'en_us',
});

const mutations: Mutations = {
  [MutationTypes.UPDATE_LANGUAGE](state, payload: keyof typeof languages) {
    state.lang = payload;
  },
};

export default {
  state,
  mutations,
};
