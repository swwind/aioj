import { expect } from "chai";
import { DELETE, generateFakeAccount, GET, POST, PUT } from "./utils";

describe('friends', () => {

  const user1 = generateFakeAccount();
  const user2 = generateFakeAccount();
  const user3 = generateFakeAccount();
  let cookie1: string;
  let cookie2: string;
  let cookie3: string;

  it('register fake accounts', async () => {
    const res1 = await POST('/api/register', user1);
    const res2 = await POST('/api/register', user2);

    expect(res1.status).eq(200);
    expect(res2.status).eq(200);

    cookie1 = res1.headers['set-cookie'][0].split(';')[0];
    cookie2 = res2.headers['set-cookie'][0].split(';')[0];
  });

  it('add friend', async () => {
    const res1 = await GET('/api/friends', null, { Cookie: cookie1 });
    expect(res1.status).eq(200);
    expect(res1.data).deep.eq({ status: 200, friends: [] });

    const res2 = await PUT(`/api/friends/${user2.username}`, null, { Cookie: cookie1 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200 });

    const res3 = await GET('/api/friends', null, { Cookie: cookie1 });
    expect(res3.status).eq(200);
    expect(res3.data).deep.eq({ status: 200, friends: [user2.username] });

    const res4 = await GET('/api/friends', null, { Cookie: cookie2 });
    expect(res4.status).eq(200);
    expect(res4.data).deep.eq({ status: 200, friends: [user1.username] });
  });

  it('add duplicated friend', async () => {
    const res1 = await PUT(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'friend_already_exists' });
  });

  it('add non-exist friend', async () => {
    const res1 = await PUT(`/api/friends/${user3.username}`, null, { Cookie: cookie1 });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'user_not_exists' });
  });

  it('delete non-exist friend', async () => {
    const res1 = await DELETE(`/api/friends/${user3.username}`, null, { Cookie: cookie2 });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'user_not_exists' });
  });

  it('delete friend', async () => {
    const res1 = await DELETE(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res1.status).eq(200);
    expect(res1.data).deep.eq({ status: 200 });

    const res2 = await GET('/api/friends', null, { Cookie: cookie1 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200, friends: [] });

    const res3 = await GET('/api/friends', null, { Cookie: cookie2 });
    expect(res3.status).eq(200);
    expect(res3.data).deep.eq({ status: 200, friends: [] });
  });

  it('delete non-friend friend', async () => {
    const res1 = await DELETE(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'friend_not_exists' });
  });

  it('complex friendship', async () => {
    const res1 = await POST('/api/register', user3);
    expect(res1.status).eq(200);
    cookie3 = res1.headers['set-cookie'][0].split(';')[0];

    const res2 = await PUT(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200 });

    const res3 = await PUT(`/api/friends/${user3.username}`, null, { Cookie: cookie2 });
    expect(res3.status).eq(200);
    expect(res3.data).deep.eq({ status: 200 });

    const res4 = await GET(`/api/friends`, null, { Cookie: cookie2 });
    expect(res4.status).eq(200);
    expect(res4.data).deep.eq({ status: 200, friends: [ user1.username, user3.username ] });

    const res5 = await DELETE(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res5.status).eq(200);
    expect(res5.data).deep.eq({ status: 200 });

    const res6 = await GET(`/api/friends`, null, { Cookie: cookie2 });
    expect(res6.status).eq(200);
    expect(res6.data).deep.eq({ status: 200, friends: [ user3.username ] });

    const res7 = await DELETE(`/api/friends/${user2.username}`, null, { Cookie: cookie3 });
    expect(res7.status).eq(200);
    expect(res7.data).deep.eq({ status: 200 });

    const res8 = await GET(`/api/friends`, null, { Cookie: cookie2 });
    expect(res8.status).eq(200);
    expect(res8.data).deep.eq({ status: 200, friends: [] });
  });
});