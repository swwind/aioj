import Koa from 'koa';
import router from './app/router.js';
import body from 'koa-body';

const app = new Koa();

app.use(body({ multipart: true }));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080);
console.log('listening on http://localhost:8080');
