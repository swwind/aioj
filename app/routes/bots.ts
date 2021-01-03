import { createNewBot, getBotDetail, modifyBot } from 'app/db/bots';
import { FILE_NOT_FOUND, LOGIN_REQUIRE, PARAMS_MISSING, PERMISSION_DENIED } from 'app/errors';
import { Tools, State } from 'app/types';
import { getTmpDir } from 'app/utils';
import { Request } from 'koa';
import Router from 'koa-router';
import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'app/judger/spawner';
import { deleteFile, saveFileWithoutUser } from 'app/db/files';

const router = new Router<State, Tools>();

async function patchSourceFile(req: Request) {
  const src = req.body.src;
  const type = req.body.type;
  if (src && type) {
    const dirname = await getTmpDir();
    const filename = `main.${type}`;
    await fs.writeFile(path.join(dirname, filename), src);
    await fs.writeFile(path.join(dirname, 'settings.json'), JSON.stringify({
      main: filename,
    }));

    await new Promise<void>((resolve, reject) => {
      exec(`zip "${
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
    const fid = await saveFileWithoutUser(buffer);

    await fs.rm(dirname, { recursive: true, force: true });

    return fid;
  }

  if (!req.files) {
    return false;
  }
  const file = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
  const buffer = await fs.readFile(file.path);
  return await saveFileWithoutUser(buffer);
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
  if (!fid) {
    ctx.end(400, PARAMS_MISSING);
    return;
  }

  await deleteFile(bd.fid);
  await modifyBot(bid, name, description, fid);

  ctx.end(200);
});

export default router;
