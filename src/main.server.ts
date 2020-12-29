import { createSSRApp } from 'vue';
import App from '@/App.vue';
import routes from './router';
import { createStore } from './store';
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import { createAPI } from './api';

import UIPlugin from './plugins/ui';

export function createVueApp(ssr: boolean, cookie?: string) {
  const SuspenseApp = {
    template: `<Suspense><App/></Suspense>`,
    components: { App },
  };
  const app = createSSRApp(SuspenseApp);
  const router = createRouter({
    history: ssr
      ? createMemoryHistory()
      : createWebHistory(),
    routes,
  });
  const api = createAPI(cookie);
  const store = createStore(router, api);
  app.use(UIPlugin);
  app.use(store);
  app.use(router);

  return { app, router, store };
}
