import { createVueApp } from './main.server';

const { app, router, store } = createVueApp(false);

if ((window as any).__INITIAL_STATE__) {
  store.replaceState((window as any).__INITIAL_STATE__);
}

router.beforeResolve((route) => {
  if (route.meta.title) {
    document.title = route.meta.title;
  }
});

router.push(location.pathname + location.search + location.hash).then(() => {
  app.mount('#app', true);
});
