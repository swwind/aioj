import { expect } from "chai";
import { DELETE, generateFakeAccount, get, post, put } from "./utils";

const user1 = generateFakeAccount();
const user2 = generateFakeAccount();
const user3 = generateFakeAccount();
let cookie1: string;
let cookie2: string;
let cookie3: string;

describe('friends', () => {
  it('register fake accounts', async () => {
    const res1 = await post('/api/register', user1);
    const res2 = await post('/api/register', user2);

    expect(res1.status).eq(200);
    expect(res2.status).eq(200);

    cookie1 = res1.headers['set-cookie'][0].split(';')[0];
    cookie2 = res2.headers['set-cookie'][0].split(';')[0];
  });

  it('add friend', async () => {
    const res1 = await get('/api/friends', null, { Cookie: cookie1 });
    expect(res1.status).eq(200);
    expect(res1.data).deep.eq({ status: 200, friends: [] });

    const res2 = await put(`/api/friends/${user2.username}`, null, { Cookie: cookie1 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200 });

    const res3 = await get('/api/friends', null, { Cookie: cookie1 });
    expect(res3.status).eq(200);
    expect(res3.data).deep.eq({ status: 200, friends: [user2.username] });

    const res4 = await get('/api/friends', null, { Cookie: cookie2 });
    expect(res4.status).eq(200);
    expect(res4.data).deep.eq({ status: 200, friends: [user1.username] });

    const res5 = await put(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res5.status).eq(400);
    expect(res5.data).deep.eq({ status: 400, error: 'friend_already_exists' });

    const res6 = await put(`/api/friends/${user3.username}`, null, { Cookie: cookie1 });
    expect(res6.status).eq(400);
    expect(res6.data).deep.eq({ status: 400, error: 'user_not_exists' });
  });

  it('delete friends', async () => {
    const res1 = await DELETE(`/api/friends/${user3.username}`, null, { Cookie: cookie2 });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'user_not_exists' });

    const res2 = await DELETE(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200 });

    const res3 = await get('/api/friends', null, { Cookie: cookie1 });
    expect(res3.status).eq(200);
    expect(res3.data).deep.eq({ status: 200, friends: [] });

    const res4 = await get('/api/friends', null, { Cookie: cookie2 });
    expect(res4.status).eq(200);
    expect(res4.data).deep.eq({ status: 200, friends: [] });
  });

  it('complex friendship', async () => {
    const res1 = await post('/api/register', user3);
    expect(res1.status).eq(200);
    cookie3 = res1.headers['set-cookie'][0].split(';')[0];

    const res2 = await put(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200 });

    const res3 = await put(`/api/friends/${user3.username}`, null, { Cookie: cookie2 });
    expect(res3.status).eq(200);
    expect(res3.data).deep.eq({ status: 200 });

    const res4 = await get(`/api/friends`, null, { Cookie: cookie2 });
    expect(res4.status).eq(200);
    expect(res4.data).deep.eq({ status: 200, friends: [ user1.username, user3.username ] });

    const res5 = await DELETE(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res5.status).eq(200);
    expect(res5.data).deep.eq({ status: 200 });

    const res6 = await get(`/api/friends`, null, { Cookie: cookie2 });
    expect(res6.status).eq(200);
    expect(res6.data).deep.eq({ status: 200, friends: [ user3.username ] });
  });
});