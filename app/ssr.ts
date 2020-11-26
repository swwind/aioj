import { renderToString } from '@vue/server-renderer';
import { createVueApp } from '../src';

export type SSRContext = {
  url: string;
}

export default async (context: SSRContext) => {
  const { app, router } = createVueApp(true);
  await router.push(context.url);
  await router.isReady();

  const code = router.currentRoute.value.fullPath === '/404' ? 404 : 200;
  const html = await renderToString(app, context);
  return {
    code,
    html: `
<!DOCTYPE html>
<html>
<head>
  <title>hello world</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@next/dist/vue.global.prod.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-router@next/dist/vue-router.global.prod.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vuex@next/dist/vuex.global.prod.js"></script>
</head>
<body>
  <div id="app">${html}</div>
  <script src="/main.js"></script>
</body>
</html>
    `
  };
}
