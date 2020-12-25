import Router from 'koa-router';
import { deleteFile, getFileData, getFileDetail, getFileDetailsByUsername, saveFile } from '../db/files';
import { LOGIN_REQUIRE, PARAMS_MISSING, PERMISSION_DENIED } from '../errors';
import { State, Tools } from '../types';
import { promises as fs } from 'fs';
import { Middleware } from 'koa';

const router = new Router<State, Tools>();

router.post('/upload', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(403, LOGIN_REQUIRE);
  }

  if (!ctx.request.files || !ctx.request.files.file) {
    return ctx.end(400, PARAMS_MISSING);
  }

  const { file } = ctx.request.files;

  const result = await saveFile(ctx.state.username, file.type, file.name, await fs.readFile(file.path));
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  return ctx.end(200, { file: result.result() });
});

export const getFileSource: Middleware = async (ctx) => {
  const result = await getFileData(ctx.params.fid);
  if (!result.ok) {
    ctx.response.status = 404;
    ctx.response.body = '404 NOT FOUND';
    return;
  }

  const file = result.result();
  const contentType = file.mimetype || 'application/octet-stream';
  if (ctx.get('Range')) {
    const range = [0, file.size - 1, file.size];
    const rg = ctx.get('Range');
    if (rg && rg.startsWith('bytes=')) {
      const [st, ed] = rg.slice(6).split('-');
      if (st) range[0] = Number(st);
      if (ed) range[1] = Number(ed);
    }

    if (isNaN(range[0]) || isNaN(range[1]) || range[0] < 0 || range[1] >= file.size || range[0] > range[1]) {
      ctx.response.status = 400;
      ctx.response.body = 'BAD RANGE HEADER';
      return;
    }

    ctx.response.status = 206;
    ctx.set('Content-Type', contentType);
    ctx.set('Content-Length', String(range[1] - range[0] + 1));
    ctx.set('Accept-Ranges', 'bytes');
    ctx.set('Cache-Control', 'max-age=31536000');
    ctx.set('Content-Range', `bytes ${range[0]}-${range[1]}/${range[2]}`);
    const buffer = await fs.readFile(file.filepath);
    ctx.response.body = buffer.slice(range[0], range[1] + 1);
  } else {
    ctx.response.status = 200;
    ctx.set('Content-Type', `${contentType}; charset=utf-8`);
    ctx.set('Content-Length', String(file.size));
    ctx.set('Accept-Ranges', 'bytes');
    ctx.set('Cache-Control', 'max-age=31536000');
    ctx.set('Content-Disposition', `inline; filename=${JSON.stringify(encodeURIComponent(file.filename))}`);
    ctx.response.body = await fs.readFile(file.filepath);
  }
};

router.get('/files/i/:fid', async (ctx) => {
  const result = await getFileDetail(ctx.params.fid);
  if (!result.ok) {
    return ctx.end(404, result.error());
  }
  ctx.end(200, { file: result.result() });
});
router.get('/files/u/:username', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  if (!ctx.state.admin && ctx.state.username !== ctx.params.username) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  const result = await getFileDetailsByUsername(ctx.params.username);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }
  ctx.end(200, { files: result.result() });
});

router.delete('/files/:fid', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(401, LOGIN_REQUIRE);
  }

  const result = await getFileData(ctx.params.fid);
  if (!result.ok) {
    return ctx.end(404, result.error());
  }
  const file = result.result();

  if (!ctx.state.admin && ctx.state.username !== file.uploader) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  await deleteFile(ctx.params.fid);
  ctx.end(200);
});

export default router;
