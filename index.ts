import Koa from 'koa';
import router from './app/router.js';
import bodyParser from 'koa-bodyparser';

const app = new Koa();

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080);
console.log('listening on http://localhost:8080');
