import { expect } from "chai";
import axios, { Method } from 'axios';

const PREFIX = 'http://localhost:8080';

const jsonRequest = (method: Method) => async (url: string, data?: Object, headers?: Object) => {
  const response = await axios.request({
    url: PREFIX + url,
    method,
    data: data ? JSON.stringify(data) : "",
    headers: {
      ...(data && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    validateStatus() {
      return true;
    }
  });
  return response;
}
const post = jsonRequest('post');
const get = jsonRequest('get');

describe('accounts', () => {
  const username = 'Attack_' + Math.random().toString(36).slice(2);
  const password = Math.random().toString(36).slice(2);
  console.log(`Test with account @${username}:${password}`);

  let auth: string;

  it('sign up a new account', async () => {
    const req = await post('/api/register', {
      username,
      password,
    });
    expect(req.status).eq(200);
    expect(req.data).deep.eq({
      status: 200,
    });
    expect(req.headers['set-cookie'][0].startsWith('auth='));
    auth = req.headers['set-cookie'][0].slice(5).split(';')[0];
    const res = await get('/api/whoami', null, {
      Cookie: `auth=${auth}`,
    });
    expect(res.status).eq(200);
    expect(req.data).deep.eq({
      status: 200
    })
  });

  it('password wrong login attempt', async () => {
    const req = await post('/api/login', {
      username,
      password: 'attack204 is akking',
    });
    expect(req.status).eq(400);
    expect(req.data).deep.eq({
      status: 400,
      error: 'password_wrong',
    });
  });

  it('param missing login attempt', async () => {
    const req = await post('/api/login', {
      username,
    });
    expect(req.status).eq(400);
    expect(req.data).deep.eq({
      status: 400,
      error: 'params_missing',
    });
  });

  it('logout require login attempt', async () => {
    const req = await post('/api/login', {
      username,
      password,
    }, {
      Cookie: `auth=${auth}`,
    });
    expect(req.status).eq(400);
    expect(req.data).deep.eq({
      status: 400,
      error: 'logout_require',
    });
  });

  it('successful login attempt', async () => {
    const req = await post('/api/login', {
      username,
      password,
    });
    expect(req.status).eq(200);
    expect(req.data).deep.eq({
      status: 200,
    });

    expect(req.headers['set-cookie'][0].startsWith('auth='));
    auth = req.headers['set-cookie'][0].slice(5).split(';')[0];

    const whoami = await get('/api/whoami', null, {
      Cookie: `auth=${auth}`,
    });
    expect(whoami.status).eq(200);
    expect(whoami.data).deep.eq({
      status: 200,
      username,
    });
  });

  it('bad logout attempt', async () => {
    const req = await post('/api/logout');
    expect(req.status).eq(401);
    expect(req.data).deep.eq({
      status: 401,
      error: 'login_require',
    });
  });

  it('successful logout attempt', async () => {
    const req = await post('/api/logout', null, {
      Cookie: `auth=${auth}`,
    });
    expect(req.status).eq(200);
    expect(req.data).deep.eq({
      status: 200,
    });

    const whoami = await get('/api/whoami', null, {
      Cookie: `auth=${auth}`,
    });
    expect(whoami.status).eq(401);
    expect(whoami.data).deep.eq({
      status: 401,
      error: 'login_require',
    });
  })
});
