import { Ref } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { APIResponse } from './api/utils';
import { ElNotification as notify } from 'element-plus';
import { translate } from './i18n/translate';
import { Store } from 'vuex';
import { MutationTypes, StoreState } from './store';
import marked from 'marked';
import insane from 'insane';

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
  ElPopconfirm as confirm,
} from 'element-plus';

export function toSizeString(size: number) {
  if (size < 0.9 * (2 ** 10)) return `${size}B`;
  if (size < 0.9 * (2 ** 20)) return `${(size / (2 ** 10)).toFixed(2)}kB`;
  if (size < 0.9 * (2 ** 30)) return `${(size / (2 ** 20)).toFixed(2)}MB`;
  if (size < 0.9 * (2 ** 40)) return `${(size / (2 ** 30)).toFixed(2)}GB`;
  return '?TB';
}

export function chooseFile() {
  return new Promise<File | null>((resolve) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.addEventListener('change', () => {
      resolve(input.files && input.files[0]);
    });
    input.click();
  });
}

export function santinizeMarked(mkd: string) {
  const html = marked(mkd)
    // add controls automatically
    .replace(/<(video|audio)\b/gi, '<$1 controls');

  return insane(html, {
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src", "alt"],
      video: ["src", "controls"],
      audio: ["src", "controls"],
    },
    allowedTags: [
      "a", "article", "b", "blockquote", "br", "caption", "code", "del", "details", "div", "em",
      "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "kbd", "li", "main", "ol",
      "p", "pre", "section", "span", "strike", "strong", "sub", "summary", "sup", "table",
      "tbody", "td", "th", "thead", "tr", "u", "ul", "video", "audio",
    ],
  });
}
