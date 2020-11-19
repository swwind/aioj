import { expect } from "chai";
import { generateFakeAccount, GET, POST } from "./utils";

describe('accounts', () => {
  const user1 = generateFakeAccount();
  const user2 = generateFakeAccount();
  let cookie1: string;
  let cookie2: string;

  it('sign up a new account', async () => {
    const res1 = await POST('/api/register', user1);
    expect(res1.status).eq(200);
    expect(res1.data).deep.eq({ status: 200 });

    expect(res1.headers['set-cookie'][0].startsWith('auth='));
    cookie1 = res1.headers['set-cookie'][0].split(';')[0];

    const res2 = await GET('/api/whoami', null, { Cookie: cookie1 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200, username: user1.username });
  });

  it('wrong password login attempt', async () => {
    const res1 = await POST('/api/login', { ...user1, password: 'attack204 is akking' });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'password_wrong' });
  });

  it('not exist user login attempt', async () => {
    const res1 = await POST('/api/login', user2);
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'user_not_exists' });
  });

  it('param missing login attempt', async () => {
    const res1 = await POST('/api/login', { username: user1.username });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'params_missing' });
  });

  it('logout require login attempt', async () => {
    const res1 = await POST('/api/login', user1, { Cookie: cookie1 });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'logout_require' });
  });

  it('successful login attempt', async () => {
    const res1 = await POST('/api/login', user1);
    expect(res1.status).eq(200);
    expect(res1.data).deep.eq({ status: 200 });

    expect(res1.headers['set-cookie'][0].startsWith('auth='));
    cookie2 = res1.headers['set-cookie'][0].split(';')[0];

    const res2 = await GET('/api/whoami', null, { Cookie: cookie2 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200, username: user1.username });
  });

  it('bad logout attempt', async () => {
    const res1 = await POST('/api/logout');
    expect(res1.status).eq(401);
    expect(res1.data).deep.eq({ status: 401, error: 'login_require' });
  });

  it('successful logout attempt', async () => {
    const res1 = await POST('/api/logout', null, { Cookie: cookie2 });
    expect(res1.status).eq(200);
    expect(res1.data).deep.eq({ status: 200 });

    const res2 = await GET('/api/whoami', null, { Cookie: cookie2 });
    expect(res2.status).eq(401);
    expect(res2.data).deep.eq({ status: 401, error: 'login_require' });
  })
});
