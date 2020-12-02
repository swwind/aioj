import { createVueApp } from './main.server';

const { app, router } = createVueApp(false);

router.beforeResolve((route) => {
  if (route.meta.title) {
    document.title = route.meta.title;
  }
});

router.push(location.pathname + location.search + location.hash).then(() => {
  app.mount('#app', true);
});
