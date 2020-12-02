import Router from 'koa-router';
import { deleteFile, getFileData, getFileDetail, getFileDetailsByUsername, saveFile } from '../db/files';
import { LOGIN_REQUIRE, PARAMS_MISSING, PERMISSION_DENIED } from '../errors';
import { State, Tools } from '../types';
import { promises as fs } from 'fs';
import { lookup } from 'mime-types';

const router = new Router<State, Tools>();

router.post('/upload', async (ctx) => {
  if (!ctx.state.authorized) {
    return ctx.end(403, PERMISSION_DENIED);
  }

  if (!ctx.verifyBody(['filename', 'file'])) {
    return ctx.end(400, PARAMS_MISSING);
  }

  const { filename, file } = ctx.request.body;

  const result = await saveFile(ctx.state.username, filename, file);
  if (!result.ok) {
    return ctx.end(400, result.error());
  }

  return ctx.end(200, { fid: result.result() });
});

router.get('/files/:fid', async (ctx) => {
  const result = await getFileData(ctx.params.fid);
  if (!result.ok) {
    return ctx.end(404, result.error());
  }

  const file = result.result();

  const range = [0, file.size - 1, file.size];
  const rg = ctx.get('Range');
  if (rg && rg.startsWith('bytes=')) {
    const [st, ed] = rg.slice(6).split('-');
    if (st) range[0] = Number(st);
    if (ed) range[1] = Number(ed);
  }

  ctx.response.status = 206;
  ctx.set('Content-Type', lookup(file.filename) || 'text/plain');
  ctx.set('Content-Length', String(range[1] - range[0] + 1));
  ctx.set('Accept-Ranges', 'bytes');
  ctx.set('Content-Range', `bytes ${range[0]}-${range[1]}/${range[2]}`);
  const buffer = await fs.readFile(file.filepath);
  ctx.response.body = buffer.slice(range[0], range[1] + 1);
});

router.get('/files/i/:fid', async (ctx) => {
  const result = await getFileDetail(ctx.params.fid);
  if (!result.ok) {
    return ctx.end(404, result.error());
  }
  ctx.end(200, result.result());
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
  ctx.end(200, { list: result.result() });
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
