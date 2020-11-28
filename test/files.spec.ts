import { expect } from "chai";
import { DELETE, generateFakeAccount, GET, parseCookie, POST, request } from "./utils";
import { promises as fs } from 'fs';
import FormData from 'form-data';

describe('files', () => {
  const user1 = generateFakeAccount();
  const user2 = generateFakeAccount();
  let cookie1: string;
  let cookie2: string;
  const root = {
    username: 'root',
    password: 'attack204_ak_world_final',
  };
  let rootc: string;
  
  it('register root and other user', async () => {
    const res1 = await POST('/api/register', root);
    if (res1.status === 200) {
      rootc = parseCookie(res1.headers);
    } else {
      const res2 = await POST('/api/login', root);
      expect(res2.status).eq(200);
      rootc = parseCookie(res2.headers);
    }

    const res3 = await POST('/api/register', user1);
    expect(res3.status).eq(200);
    // expect(res3.data).deep.eq({ status: 200 });
    cookie1 = parseCookie(res3.headers);
    const res4 = await POST('/api/register', user2);
    expect(res4.status).eq(200);
    // expect(res4.data).deep.eq({ status: 200 });
    cookie2 = parseCookie(res4.headers);
  });

  let fid1: string;
  let fid2: string;
  let buf1: Buffer;
  let buf2: Buffer;
  it('upload a new file by user', async () => {
    buf1 = await fs.readFile('config.json');
    const formdata = new FormData();
    formdata.append('filename', 'config.json');
    formdata.append('file', buf1);
    const headers = formdata.getHeaders();
    headers.Cookie = cookie1;
    const res = await request({
      method: 'post',
      url: '/api/upload',
      data: formdata.getBuffer(),
      headers,
    });
    expect(res.status).eq(200);
    expect(res.data.fid).a('string');
    expect(res.data.fid.length).eq(32);
    fid1 = res.data.fid;
  });
  it('upload a new file by root', async () => {
    buf2 = await fs.readFile('.gitignore');
    const formdata = new FormData();
    formdata.append('filename', '.gitignore');
    formdata.append('file', buf2);
    const headers = formdata.getHeaders();
    headers.Cookie = rootc;
    const res = await request({
      method: 'post',
      url: '/api/upload',
      data: formdata.getBuffer(),
      headers,
    });

    expect(res.status).eq(200);
    expect(res.data.fid).a('string');
    expect(res.data.fid.length).eq(32);
    fid2 = res.data.fid;
  });
  it('fetch file', async () => {
    const res = await GET(`/api/files/${fid1}`);
    expect(res.status).eq(206);
    expect(res.headers['content-type']).eq('application/json');
    expect(res.headers['accept-ranges']).eq('bytes');
    expect(res.headers['content-range']).eq(`bytes 0-${buf1.length - 1}/${buf1.length}`);
    expect(res.headers['content-length']).eq(String(buf1.length));
  });
  it('fetch file by range', async () => {
    const res = await GET(`/api/files/${fid1}`, null, { Range: 'bytes=0-19' });
    expect(res.status).eq(206);
    expect(res.headers['content-type']).eq('application/json');
    expect(res.headers['accept-ranges']).eq('bytes');
    expect(res.headers['content-range']).eq(`bytes 0-19/${buf1.length}`);
    expect(res.headers['content-length']).eq('20');
    expect(res.data).eq(buf1.slice(0, 20).toString());
  });
  it('get file\'s infomation', async () => {
    const res = await GET(`/api/files/i/${fid1}`);
    expect(res.data.status).eq(200);
    expect(res.data.filename).eq('config.json');
    expect(res.data.fid).eq(fid1);
    expect(res.data.size).a('number');
    expect(res.data.size).eq(buf1.length);
    expect(res.data.uploader).eq(user1.username);
    expect(res.data.date).a('number');
    expect(Math.abs(res.data.date - Date.now())).lte(1000);
  });
  it('get user\'s upload list by user', async () => {
    const res = await GET(`/api/files/u/${user1.username}`, null, { Cookie: cookie1 });
    expect(res.data.status).eq(200);
    expect(res.data.list).a('array');
    expect(res.data.list.length).eq(1);
    expect(res.data.list[0].fid).eq(fid1);
  });
  it('get user\'s upload list by root', async () => {
    const res = await GET(`/api/files/u/${user1.username}`, null, { Cookie: rootc });
    expect(res.data.status).eq(200);
    expect(res.data.list).a('array');
    expect(res.data.list.length).eq(1);
    expect(res.data.list[0].fid).eq(fid1);
  });
  it('get root\'s upload list by user', async () => {
    const res = await GET(`/api/files/u/${root.username}`, null, { Cookie: cookie1 });
    expect(res.data.status).eq(403);
    expect(res.data.error).eq('permission_denied');
  });
  it('delete user\'s file by root', async () => {
    const res = await DELETE(`/api/files/${fid1}`, null, { Cookie: rootc });
    expect(res.data).deep.eq({ status: 200 });
  });
  it('delete root\'s file by user', async () => {
    const res = await DELETE(`/api/files/${fid2}`, null, { Cookie: cookie1 });
    expect(res.data).deep.eq({ status: 403, error: 'permission_denied' });
  });
  it('delete root\'s file by root', async () => {
    const res = await DELETE(`/api/files/${fid2}`, null, { Cookie: rootc });
    expect(res.data).deep.eq({ status: 200 });
  });
  it('delete non-exists file', async () => {
    const res = await DELETE(`/api/files/${fid1}`, null, { Cookie: rootc });
    expect(res.data).deep.eq({ status: 404, error: 'file_not_found' });
  });
});
