import { APIResponse } from '@/api/utils';
import { translate } from '@/i18n/translate';
import { notify } from '@/utils';
import { Router } from 'vue-router';
import type { ArgumentedActionContext, RootState } from '.';
import { ActionTypes } from './action-types';
import type { ModuleActions } from './modules';
import { MutationTypes } from './mutation-types';

type Actions<S = RootState> = {
  [ActionTypes.HANDLE_ERROR](actx: ArgumentedActionContext<S>, payload: APIResponse): Promise<void>;
  [ActionTypes.NOTIFY_DELETE_SUCCESS](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.ROUTER_PUSH](actx: ArgumentedActionContext<S>, payload: string): Promise<void>;
  [ActionTypes.NOTIFY_REPLY_SUCCESS](actx: ArgumentedActionContext<S>): Promise<void>;
}

export type RootActions = Actions & ModuleActions;

const createActions = (router: Router): Actions => ({
  async [ActionTypes.HANDLE_ERROR]({ commit, state }, payload) {
    if (payload.status >= 400) {
      notify({
        title: translate(state.i18n.lang, 'error'),
        type: 'error',
        message: translate(state.i18n.lang, payload.error as any),
      });

      commit(MutationTypes.CHANGE_SSR_STATUS, 404);
      commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(state.i18n.lang, 'not_found')} - AIOJ`);
    }
  },
  async [ActionTypes.NOTIFY_DELETE_SUCCESS]({ state }) {
    notify({
      title: translate(state.i18n.lang, 'success'),
      type: 'success',
      message: translate(state.i18n.lang, 'delete_success'),
    });
  },
  async [ActionTypes.ROUTER_PUSH](_, payload: string) {
    router.push(payload);
  },
  async [ActionTypes.NOTIFY_REPLY_SUCCESS]({ state }) {
    notify({
      type: 'success',
      title: translate(state.i18n.lang, 'success'),
      message: translate(state.i18n.lang, 'reply_success'),
    });
  },
});

export default createActions;
