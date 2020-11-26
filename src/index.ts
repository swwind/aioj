import { createApp, createSSRApp, h } from 'vue';
import App from '@/App.vue';
import routes from './router';
import store from './store';
import ElementUI from 'element-plus';
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';

export function createVueApp(ssr: boolean) {
  const app = ssr
    ? createSSRApp({ render: () => h(App) })
    : createApp(App);
  const router = createRouter({
    history: ssr
      ? createMemoryHistory()
      : createWebHistory(),
    routes,
  });
  app.use(ElementUI);
  app.use(store);
  app.use(router);
  return { app, router };
}
