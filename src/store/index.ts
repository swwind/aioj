import { handleNetworkRequestError } from '@/utils';
import { createStore } from 'vuex';
import { HANDLE_ERROR } from './action-types';
import modules, { StoreState } from './modules';

const store = () => createStore<StoreState>({
  modules,
  actions: {
    async [HANDLE_ERROR](store, payload) {
      handleNetworkRequestError(store, payload);
    }
  }
});

export default store;
export type { StoreState };
export * as MutationTypes from './mutation-types';
export * as ActionTypes from './action-types';
