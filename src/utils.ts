import { Ref, unref } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { translate } from './i18n/translate';
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

export const confirm = async (lang: string, message: string) => {
  const confirm = document.createElement('div'); confirm.classList.add('confirm');
  const window = document.createElement('div'); window.classList.add('window');
  const title = document.createElement('div'); title.classList.add('title');
  const content = document.createElement('div'); content.classList.add('content');
  const buttons = document.createElement('div'); buttons.classList.add('buttons');
  const cancel = document.createElement('div'); cancel.classList.add('cancel');
  const ok = document.createElement('div'); ok.classList.add('ok');

  confirm.appendChild(window);
  window.appendChild(title);
  window.appendChild(content);
  window.appendChild(buttons);
  buttons.appendChild(cancel);
  buttons.appendChild(ok);

  title.innerText = translate(lang, 'warning');
  content.innerText = message;
  cancel.innerText = translate(lang, 'cancel');
  ok.innerText = translate(lang, 'ok');

  document.body.appendChild(confirm);
  setTimeout(() => confirm.classList.add('show'));

  const remove = () => {
    confirm.classList.remove('show');
    setTimeout(() => {
      confirm.remove();
    }, 300);
  };

  return new Promise((resolve) => {
    ok.addEventListener('click', () => {
      remove();
      resolve(true);
    });
    cancel.addEventListener('click', () => {
      remove();
      resolve(false);
    });
  });
};

export const notify = (type: string, content: string) => {
  if (typeof document === 'undefined') {
    // in ssr
    return;
  }
  const div = document.createElement('div');
  div.classList.add('notification');
  div.classList.add(type);
  div.innerText = content;
  document.body.appendChild(div);
  setTimeout(() => {
    div.remove();
  }, 2500);
};

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
      a: ['href', 'name', 'target'],
      img: ['src', 'alt'],
      video: ['src', 'controls'],
      audio: ['src', 'controls'],
    },
    allowedTags: [
      'a', 'article', 'b', 'blockquote', 'br', 'caption', 'code', 'del', 'details', 'div', 'em',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'ins', 'kbd', 'li', 'main', 'ol',
      'p', 'pre', 'section', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table',
      'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul', 'video', 'audio',
    ],
  });
}

export type Argument<S> = S | Ref<S>;
export type Arguments<S = {}> = { [K in keyof S]: Argument<S[K]> };
export function unwarpArguments<T>(arg: Arguments<T>): T;
export function unwarpArguments(arg: any) {
  const newobj = { } as any;
  for (const key of Object.keys(arg)) {
    newobj[key] = unref(arg[key]);
  }
  return newobj;
}
