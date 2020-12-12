import { translate } from '@/i18n/translate';
import { handleNetworkRequestError, notify } from '@/utils';
import { Router } from 'vue-router';
import { createStore } from 'vuex';
import { HANDLE_ERROR, NOTIFY_DELETE_SUCCESS, NOTIFY_REPLY_SUCCESS, ROUTER_PUSH } from './action-types';
import modules, { StoreState } from './modules';

const store = (router: Router) => createStore<StoreState>({
  modules,
  actions: {
    async [HANDLE_ERROR](store, payload) {
      handleNetworkRequestError(store, payload);
    },
    async [NOTIFY_DELETE_SUCCESS]({ state }) {
      notify({
        title: translate(state.i18n.lang, 'success'),
        type: 'success',
        message: translate(state.i18n.lang, 'delete_success'),
      });
    },
    async [ROUTER_PUSH](store, payload: string) {
      router.push(payload);
    },
    async [NOTIFY_REPLY_SUCCESS]({ state }) {
      notify({
        type: 'success',
        title: translate(state.i18n.lang, 'success'),
        message: translate(state.i18n.lang, 'reply_success'),
      });
    }
  },
});

export default store;
export type { StoreState };
export * as MutationTypes from './mutation-types';
export * as ActionTypes from './action-types';
