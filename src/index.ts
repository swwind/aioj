import { createApp, createSSRApp } from 'vue';
import App from '@/App.vue';
import routes from './router';
import store from './store';
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';

export function createVueApp(ssr: boolean) {
  const app = (ssr ? createSSRApp : createApp)(App);
  const router = createRouter({
    history: ssr
      ? createMemoryHistory()
      : createWebHistory(),
    routes,
  });
  app.use(store);
  app.use(router);
  return { app, router };
}
