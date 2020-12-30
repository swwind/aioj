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
  [ActionTypes.HANDLE_RENDER_ERROR](actx: ArgumentedActionContext<S>, payload: APIResponse): Promise<void>;
  [ActionTypes.NOTIFY_DELETE_SUCCESS](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.NOTIFY_REPLY_SUCCESS](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.NOTIFY_UPDATE_SUCCESS](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.NOTIFY_COPY_FAILED](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.NOTIFY_COPY_SUCCESS](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.ROUTER_PUSH](actx: ArgumentedActionContext<S>, payload: string): Promise<void>;
}

export type RootActions = Actions & ModuleActions;

const createActions = (router: Router): Actions => ({
  async [ActionTypes.HANDLE_ERROR]({ state }, payload) {
    if (payload.status >= 400) {
      notify('error', translate(state.i18n.lang, payload.error));
    }
  },
  async [ActionTypes.HANDLE_RENDER_ERROR]({ commit, state, dispatch }, payload) {
    if (payload.status >= 400) {
      dispatch(ActionTypes.HANDLE_ERROR, payload);
      commit(MutationTypes.CHANGE_SSR_STATUS, 404);
      commit(MutationTypes.CHANGE_SSR_TITLE, translate(state.i18n.lang, 'not_found'));
    }
  },
  async [ActionTypes.NOTIFY_DELETE_SUCCESS]({ state }) {
    notify('success', translate(state.i18n.lang, 'delete_success'));
  },
  async [ActionTypes.ROUTER_PUSH](_, payload: string) {
    router.push(payload);
  },
  async [ActionTypes.NOTIFY_REPLY_SUCCESS]({ state }) {
    notify('success', translate(state.i18n.lang, 'reply_success'));
  },
  async [ActionTypes.NOTIFY_UPDATE_SUCCESS]({ state }) {
    notify('success', translate(state.i18n.lang, 'update_success'));
  },
  async [ActionTypes.NOTIFY_COPY_SUCCESS]({ state }) {
    notify('success', translate(state.i18n.lang, 'copy_success'));
  },
  async [ActionTypes.NOTIFY_COPY_FAILED]({ state }) {
    notify('success', translate(state.i18n.lang, 'copy_fail'));
  },
});

export default createActions;
