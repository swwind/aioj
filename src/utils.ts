import { Ref, unref } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { translate } from './i18n/translate';

import config from '../config.json';

import markdownit from 'markdown-it';
import mkditkatex from 'markdown-it-katex';

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

export const confirm = async (lang: string, message: string, ...args: string[]) => {
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
  content.innerText = translate(lang, message, ...args);
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
    const end = (choice: boolean) => () => {
      remove();
      resolve(choice);
    };
    ok.addEventListener('click', end(true));
    cancel.addEventListener('click', end(false));
    confirm.addEventListener('click', end(false));
    window.addEventListener('click', (e) => e.stopPropagation());
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
  return 'Impossible Size';
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

const marked = markdownit();
marked.use(mkditkatex, {
  throwOnError: 'false',
});

// https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
function escapeHTML(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

marked.use((md) => {
  const defaultRender = md.renderer.rules.image;
  const reg = /^aioj:\/\/(video|audio|image|flv|fs)\/([a-z0-9]+)$/;
  if (!defaultRender) return;

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const aIndex = token.attrIndex('src');
    const url = token.attrs?.[aIndex][1];
    const alt = token.content;

    if (url && reg.test(url)) {
      const matchres = url.match(reg);
      if (matchres) {
        const type = matchres[1];
        const fid = matchres[2];
        const src = `${config.env === 'production' ? `//${config.cdn}` : ''}/f/${fid}`;
        if (type === 'video') {
          return `<video controls src="${src}"></video>`;
        } else if (type === 'audio') {
          return `<audio controls src="${src}"></audio>`;
        } else if (type === 'image') {
          return `<img alt="${encodeURIComponent(alt)}" src="${src}">`;
        } else if (type === 'fs') {
          return `<a href="${src}" target="_blank">${escapeHTML(alt)}</a>`;
        } else if (type === 'flv') {
          return `<video controls data-flv-src="${src}"></video>`;
        }
      }
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };
});

export function santinizeMarked(mkd: string) {
  return marked.render(mkd);
}

export async function copyToClipboard(text: string) {
  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
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
