import { API } from '@/api';
import { languages } from '@/i18n';
import { MutationTypes } from '../mutation-types';

export type State = {
  lang: keyof typeof languages;
}

export type Mutations<S = State> = {
  [MutationTypes.UPDATE_LANGUAGE](state: S, payload: string): void;
}

export type Actions = { };

export const createI18nModule = (api: API) => {

const state = (): State => ({
  lang: 'en_us',
});

const mutations: Mutations = {
  [MutationTypes.UPDATE_LANGUAGE](state, payload: keyof typeof languages) {
    state.lang = payload;
  },
};

return {
  state,
  mutations,
};

}
