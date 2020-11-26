import Koa from 'koa';
import router from './app/router';
import body from 'koa-body';
import serve from 'koa-static';

const app = new Koa();

app.use(body({ multipart: true }));
app.use(serve('dist'));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080);
console.log('listening on http://localhost:8080');
