import { API } from '@/api';
import { ArgumentedActionContext } from '..';
import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';

type Breadcrumb = {
  name: string;
  url: string;
  show: boolean;
}

export type State = {
  status: number;
  title: Breadcrumb[];
  meta: Record<string, string>;
}

export type Mutations<S = State> = {
  [MutationTypes.CHANGE_SSR_STATUS](state: S, payload: number): void;
  [MutationTypes.CHANGE_SSR_TITLE](state: S, payload: string | Breadcrumb | (string | Breadcrumb)[]): void;
  [MutationTypes.CHANGE_SSR_META](state: S, payload: Record<string, string>): void;
}

export type Actions<S = State> = {
  [ActionTypes.UNBLOCK_SSR](ctx: ArgumentedActionContext<S>): void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSSRModule = (api: API) => {
  const state = (): State => ({
    status: 200,
    title: [],
    meta: {},
  });

  const mutations: Mutations = {
    [MutationTypes.CHANGE_SSR_STATUS](state, payload) {
      state.status = payload;
    },
    [MutationTypes.CHANGE_SSR_TITLE](state, payload) {
      const title = (Array.isArray(payload) ? payload : [ payload ]).map((x): Breadcrumb => {
        if (typeof x === 'string') {
          return {
            name: x,
            url: '',
            show: true,
          }
        }
        return x;
      });
      if (typeof document !== 'undefined') {
        document.title = title.filter((x) => x.show).map((x) => x.name).join(' :: ') + ' - AIOJ';
      }
      state.title = title;
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
