import { Ref } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { APIResponse } from './api/utils';
import { ElNotification as notify } from 'element-plus';
import { translate } from './i18n/translate';

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

export function handleNetworkRequestError(lang: string, result: APIResponse) {
  if (result.status >= 400) {
    notify({
      title: translate(lang as any, 'error'),
      type: 'error',
      message: translate(lang as any, result.error as any),
    });
  }
}
