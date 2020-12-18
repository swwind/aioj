import { API } from '@/api';
import { ArgumentedActionContext } from '..';
import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';

export type State = {
  status: number;
  title: string;
  meta: Record<string, string>;
}

export type Mutations<S = State> = {
  [MutationTypes.CHANGE_SSR_STATUS](state: S, payload: number): void;
  [MutationTypes.CHANGE_SSR_TITLE](state: S, payload: string): void;
  [MutationTypes.CHANGE_SSR_META](state: S, payload: Record<string, string>): void;
}

export type Actions<S = State> = {
  [ActionTypes.UNBLOCK_SSR](ctx: ArgumentedActionContext<S>): void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSSRModule = (api: API) => {
  const state = (): State => ({
    status: 200,
    title: '',
    meta: {},
  });

  const mutations: Mutations = {
    [MutationTypes.CHANGE_SSR_STATUS](state, payload) {
      state.status = payload;
    },
    [MutationTypes.CHANGE_SSR_TITLE](state, payload) {
      if (typeof global.document !== 'undefined') {
        document.title = payload;
      }
      state.title = payload;
    },
    [MutationTypes.CHANGE_SSR_META](state, payload) {
      state.meta = payload;
    },
  };

  const actions: Actions = {
    [ActionTypes.UNBLOCK_SSR]() {
      api.unblockSSR();
    }
  }

  return {
    state,
    mutations,
    actions,
  };
};
