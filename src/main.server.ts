import { createApp, createSSRApp, defineComponent } from 'vue';
import App from '@/App.vue';
import routes from './router';
import createStore from './store';
import ElementPlus from 'element-plus';
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';

export function createVueApp(ssr: boolean) {
  const SuspenseApp = defineComponent({
    template: '<Suspense><App/></Suspense>',
    components: { App },
  });
  const app = ssr
    ? createSSRApp(SuspenseApp)
    : createApp(SuspenseApp);
  const router = createRouter({
    history: ssr
      ? createMemoryHistory()
      : createWebHistory(),
    routes,
  });
  const store = createStore();
  app.use(ElementPlus);
  app.use(store);
  app.use(router);

  return { app, router, store };
}

export { setMockingCookie } from '@/api';
