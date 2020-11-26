import { createVueApp } from '.';

const { app, router } = createVueApp(false);
router.push(location.pathname + location.search).then(() => {
  app.mount('#app', true);
});
