import { auths } from '../db';
import crypto from 'crypto';

function generateRandomCookie() {
  return crypto.randomBytes(32).toString('hex');
}
async function generateValidCookie() {
  let cookie = generateRandomCookie();
  while (await auths.findOne({ token: cookie })) {
    cookie = generateRandomCookie();
  }
  return cookie;
}

export async function issueCookie(username: string) {
  const cookie = await generateValidCookie();
  await auths.insertOne({ username, token: cookie, date: Date.now() });
  return cookie;
}

export async function revoke(cookie: string) {
  await auths.deleteOne({ token: cookie });
}

export async function verify(cookie: string): Promise<string | false> {
  const result = await auths.findOne({ token: cookie });
  if (result) {
    return result.username;
  }
  return false;
}
