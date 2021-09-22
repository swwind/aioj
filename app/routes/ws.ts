// WS is temporarily disabled


// import { WSS } from '../judger/wss';
// import Router from 'koa-router';

// type WsTools = {
//   websocket: WebSocket;
// }

// export const createWsRouter = (wss: WSS) => {
//   const router = new Router<{}, WsTools>();

//   router.all('/round/:rid', (ctx) => {
//     const rid = Number(ctx.params.rid);

//     wss.register(rid, ctx.websocket);
//     ctx.websocket.onclose = () => {
//       wss.unregister(rid, ctx.websocket);
//     };
//   });

//   return router;
// };
