import { expect } from "chai";
import { DELETE, generateFakeAccount, GET, POST, randomBytes } from "./utils";

describe('forum', () => {
  const root = {
    username: 'root',
    password: 'attack204_ak_world_final',
  };
  const user1 = generateFakeAccount();
  let cookie1: string;
  let cookie2: string;

  it('register root (if not) and user', async () => {
    const res1 = await POST('/api/register', root);
    if (res1.status === 200) {
      cookie1 = res1.headers['set-cookie'][0].split(';')[0];
    } else {
      const res2 = await POST('/api/login', root);
      expect(res2.status).eq(200);
      cookie1 = res2.headers['set-cookie'][0].split(';')[0];
    }
    const res3 = await POST('/api/register', user1);
    cookie2 = res3.headers['set-cookie'][0].split(';')[0];
  });

  const region = randomBytes(16);
  const title = 'Hello world ' + randomBytes(8);
  const description = 'Description qwq ' + randomBytes(8);

  it('create a region without permission', async () => {
    const res = await POST(`/api/r/${region}`, { title, description }, { Cookie: cookie2 });
    expect(res.data).deep.eq({ status: 403, error: 'permission_denied' });
  });

  it('create a region', async () => {
    const res = await POST(`/api/r/${region}`, { title, description }, { Cookie: cookie1 });
    expect(res.data).deep.eq({ status: 200 });
  });

  it('create a duplicated region', async () => {
    const res = await POST(`/api/r/${region}`, { title, description }, { Cookie: cookie1 });
    expect(res.data).deep.eq({ status: 400, error: 'region_already_exists' });
  });

  it('get regions list', async () => {
    const res = await GET('/api/regions');
    expect(res.data.list[0].region).eq(region);
    expect(res.data.list[0].title).eq(title);
    expect(res.data.list[0].description).eq(description);
  });

  let pid1: number, pid2: number;
  const postTitle = 'This is my post!!! ' + randomBytes(4);
  const postContent = 'RT!!!\n' + randomBytes(16);
  it('create post by root', async () => {
    const res = await POST(`/api/r/${region}/post`, {
      title: postTitle,
      content: postContent,
    }, { Cookie: cookie1 });
    expect(res.data).deep.eq({ status: 200, pid: 1 });
    pid1 = res.data.pid;
  });

  it('create post by user', async () => {
    const res = await POST(`/api/r/${region}/post`, {
      title: postTitle,
      content: postContent,
    }, { Cookie: cookie2 });
    expect(res.data).deep.eq({ status: 200, pid: 2 });
    pid2 = res.data.pid;
  });

  const commentContent = 'Elaina is my waifu!!!';
  it('create comment', async () => {
    const res = await POST(`/api/r/${region}/${pid1}/comment`, {
      content: commentContent,
    }, { Cookie: cookie2 });
    expect(res.data).deep.eq({ status: 200, cid: 2 });
  });

  it('delete comment without permission', async () => {
    const res = await DELETE(`/api/r/${region}/${pid1}/1`, null, { Cookie: cookie2 });
    expect(res.data).deep.eq({ status: 403, error: 'permission_denied' });
  });

  it('delete comment', async () => {
    const res = await DELETE(`/api/r/${region}/${pid1}/2`, null, { Cookie: cookie2 });
    expect(res.data).deep.eq({ status: 200 });
  });

  it('try to delete root post by user', async () => {
    const res = await DELETE(`/api/r/${region}/${pid1}`, null, { Cookie: cookie2 });
    expect(res.data).deep.eq({ status: 403, error: 'permission_denied' });
  });

  it('delete user\'s post by root', async () => {
    const res = await DELETE(`/api/r/${region}/${pid2}`, null, { Cookie: cookie1 });
    expect(res.data).deep.eq({ status: 200 });
  });

  it('try to delete non-exist post', async () => {
    const res = await DELETE(`/api/r/${region}/${pid2}`, null, { Cookie: cookie1 });
    expect(res.data).deep.eq({ status: 404, error: 'post_not_exists' });
  });

  it('delete region without permission', async () => {
    const res = await DELETE(`/api/r/${region}`, null, { Cookie: cookie2 });
    expect(res.data).deep.eq({ status: 403, error: 'permission_denied' });
  });

  it('delete region', async () => {
    const res = await DELETE(`/api/r/${region}`, null, { Cookie: cookie1 });
    expect(res.data).deep.eq({ status: 200 });
  });

  it('get regions list after remove', async () => {
    const res = await GET('/api/regions');
    expect(res.data).deep.eq({ status: 200, list: [ ] });
  });

});