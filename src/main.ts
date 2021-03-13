import { createSSRApp } from 'vue';
import App from './AsyncApp.vue';
import { createRouter } from './router';
import { createStore } from './store';
import { createAPI } from './api';

import UIPlugin from './plugins/ui';

export function createApp(cookie?: string) {
  const app = createSSRApp(App);
  const router = createRouter();
  const api = createAPI(cookie);
  const store = createStore(router, api);
  app.use(UIPlugin);
  app.use(store);
  app.use(router);

  return { app, router, store };
}
