import { createNewBot, getBotDetail, getBotList, getBotRecentRoundDetail, getBotsDetail, modifyBot, modifyBotInfo } from '../db/bots';
import { FILE_NOT_FOUND, LOGIN_REQUIRE, PARAMS_MISSING, PERMISSION_DENIED } from '../errors';
import { Tools, State } from '../types';
import { Request } from 'koa';
import Router from 'koa-router';
import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { deleteFile, saveFileWithoutUser } from '../db/files';

const router = new Router<State, Tools>();

const recieveLanguage = ['cpp', 'c', 'js', 'ts', 'py2', 'py3'];

function getSettings(type: string, filename: string): string {
  if (type === 'cpp') {
    return JSON.stringify({
      build: `g++ ${filename} -o main -O2 -DONLINE_JUDGE`,
      run: './main',
    });
  }
  if (type === 'c') {
    return JSON.stringify({
      build: `gcc ${filename} -o main -DONLINE_JUDGE`,
      run: './main',
    });
  }
  if (type === 'js') {
    return JSON.stringify({
      build: '',
      run: `node ${filename}`,
    });
  }
  if (type === 'ts') {
    return JSON.stringify({
      build: '',
      run: `deno ${filename}`,
    });
  }
  if (type === 'py2') {
    return JSON.stringify({
      build: '',
      run: `python2 ${filename}`,
    });
  }
  if (type === 'py3') {
    return JSON.stringify({
      build: '',
      run: `python3 ${filename}`,
    });
  }
  throw new Error('unknown language');
}

async function patchSourceFile(req: Request) {
  const src = req.body.src;
  const type = req.body.type;

  if (src && type && recieveLanguage.indexOf(type) > -1) {
    const dirname = await fs.mkdtemp(path.join(os.tmpdir(), 'aioj-bot'));
    const filename = `main.${type}`;
    await fs.writeFile(path.join(dirname, filename), src);
    await fs.writeFile(path.join(dirname, 'settings.json'), getSettings(type, filename));

    await new Promise<void>((resolve, reject) => {
      exec(`zip -j "${
        path.join(dirname, 'pack.zip')
      }" "${
        path.join(dirname, filename)
      }" "${
        path.join(dirname, 'settings.json')
      }"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const buffer = await fs.readFile(path.join(dirname, 'pack.zip'));
    const fid = await saveFileWithoutUser(buffer, 'code.zip');

    await fs.rm(dirname, { recursive: true, force: true });

    return fid;
  }

  if (!req.files) {
    return false;
  }
  const file = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
  const buffer = await fs.readFile(file.path);
  return await saveFileWithoutUser(buffer, file.name);
}

router.post('/b/:pid', async (ctx) => {
  if (!ctx.verifyBody({
    name: 'string',
    description: 'string',
  })) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const pid = Number(ctx.params.pid);

  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const username = ctx.state.username;

  const { name, description } = ctx.request.body;

  const fid = await patchSourceFile(ctx.request);
  if (!fid) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  const bid = await createNewBot(username, name, description, fid, pid);

  ctx.end(200, { bid });
});

router.put('/b/:bid', async (ctx) => {
  if (!ctx.verifyBody({
    name: 'string',
    description: 'string',
  })) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  if (!ctx.state.authorized) {
    ctx.end(401, LOGIN_REQUIRE);
    return;
  }

  const bid = Number(ctx.params.bid);
  const bd = await getBotDetail(bid);
  if (!bd) {
    ctx.end(404, FILE_NOT_FOUND);
    return;
  }

  if (bd.author !== ctx.state.username && !ctx.state.admin) {
    ctx.end(403, PERMISSION_DENIED);
    return;
  }

  const { name, description } = ctx.request.body;

  const fid = await patchSourceFile(ctx.request);
  if (fid) {
    await deleteFile(bd.fid);
    await modifyBot(bid, name, description, fid);
  } else {
    await modifyBotInfo(bid, name, description);
  }

  const bot = await getBotDetail(bid);

  ctx.end(200, { bot });
});

router.get('/b/list', async (ctx) => {
  const pid = typeof ctx.query.p !== 'undefined' ? Number(ctx.query.p) : undefined;
  const username = typeof ctx.query.u !== 'undefined' ? String(ctx.query.u) : undefined;

  const bots = await getBotList(pid, username);
  ctx.end(200, { bots });
});

router.get('/b/many', async (ctx) => {
  const bids = typeof ctx.query.bids !== 'undefined'
    ? ctx.query.bids.toString().split(',').map(Number).filter(x => !isNaN(x))
    : [];
  if (!bids.length) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }
  const bots = await getBotsDetail(bids);
  if (!bots) {
    ctx.end(404, FILE_NOT_FOUND);
    return;
  }
  ctx.end(200, { bots });
});

router.get('/b/recent/:bid', async (ctx) => {
  const bid = Number(ctx.params.bid);
  const bot_rounds = await getBotRecentRoundDetail(bid);
  if (!bot_rounds) {
    ctx.end(404, FILE_NOT_FOUND);
    return;
  }
  ctx.end(200, { bot_rounds });
});

router.get('/b/:bid', async (ctx) => {
  const bid = Number(ctx.params.bid);
  const bot = await getBotDetail(bid);
  if (!bot) {
    ctx.end(404, FILE_NOT_FOUND);
    return;
  }
  ctx.end(200, { bot });
});

export default router;
