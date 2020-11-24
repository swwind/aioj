import { expect } from 'chai';
import { generateFakeAccount, GET, parseCookie, POST, PUT } from './utils';

describe('users', () => {
  const user1 = generateFakeAccount();
  const user2 = generateFakeAccount();
  let cookie1: string;
  let cookie2: string;
  const root = {
    username: 'root',
    password: 'attack204_ak_world_final',
  };
  let rootc: string;

  it('register root and user', async () => {
    const res1 = await POST('/api/register', root);
    if (res1.status === 200) {
      rootc = parseCookie(res1.headers);
    } else {
      const res2 = await POST('/api/login', root);
      expect(res2.status).eq(200);
      rootc = parseCookie(res2.headers);
    }

    const res3 = await POST('/api/register', user1);
    expect(res3.data).deep.eq({ status: 200 });
    cookie1 = parseCookie(res3.headers);
    const res4 = await POST('/api/register', user2);
    expect(res4.data).deep.eq({ status: 200 });
    cookie2 = parseCookie(res4.headers);
  });

  it('modify detail by self', async () => {
    const description = 'Elaina is my waifu!!';
    const email = 'elaina@gmail.com';

    const res1 = await PUT(`/api/u/${user1.username}`, {
      description,
      email,
    }, { Cookie: cookie1 });
    expect(res1.data).deep.eq({ status: 200 });

    const res2 = await GET(`/api/u/${user1.username}`);
    expect(res2.data).deep.eq({
      status: 200,
      username: user1.username,
      description,
      email,
      admin: false,
    });
  });

  it('modify detail by root', async () => {
    const description = 'Emilia is my waifu!!';
    const email = 'emilia@gmail.com';

    const res1 = await PUT(`/api/u/${user1.username}`, {
      description,
      email,
    }, { Cookie: rootc });
    expect(res1.data).deep.eq({ status: 200 });

    const res2 = await GET(`/api/u/${user1.username}`);
    expect(res2.data).deep.eq({
      status: 200,
      username: user1.username,
      description,
      email,
      admin: false,
    });
  });

  it('modify detail by other', async () => {
    const description = 'Megumin is my waifu!!';
    const email = 'megumin@gmail.com';

    const res1 = await PUT(`/api/u/${user1.username}`, {
      description,
      email,
    }, { Cookie: cookie2 });
    expect(res1.data).deep.eq({ status: 403, error: 'permission_denied' });
  });
});