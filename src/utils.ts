import { Ref } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { APIResponse } from './api/utils';
import { ElNotification as notify } from 'element-plus';
import { translate } from './i18n/translate';
import { Store } from 'vuex';
import { MutationTypes, StoreState } from './store';

export function getRedirect(router: Ref<RouteLocationNormalizedLoaded>) {
  let ret = '';

  if (router.value.path === '/login' || router.value.path === '/register') {
    if (router.value.query.redirect) {
      ret = String(router.value.query.redirect);
    }
  } else {
    ret = router.value.path;
  }

  return ret ? `?redirect=${encodeURIComponent(ret)}` : '';
}

export function handleNetworkRequestError(store: Store<StoreState>, result: APIResponse) {
  if (result.status >= 400) {
    notify({
      title: translate(store.state.i18n.lang, 'error'),
      type: 'error',
      message: translate(store.state.i18n.lang, result.error as any),
    });

    store.commit(MutationTypes.CHANGE_SSR_STATUS, 404);
    store.commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(store.state.i18n.lang, 'not_found')} - AIOJ`);
  }
}

export {
  ElNotification as notify,
  ElMessageBox as msgbox,
  ElPopconfirm as confim,
} from 'element-plus';
