import crypto from 'crypto';

const auths = new Map<string, string>();

function generateRandomCookie() {
  return crypto.randomBytes(32).toString('hex');
}
function generateValidCookie() {
  let cookie = generateRandomCookie();
  while (auths.has(cookie)) {
    cookie = generateRandomCookie();
  }
  return cookie;
}

export function issueCookie(username: string) {
  const cookie = generateValidCookie();
  auths.set(cookie, username);
  return cookie;
}

export function revoke(cookie: string) {
  auths.delete(cookie);
}

export function verify(cookie: string): string | false {
  if (auths.has(cookie)) {
    return auths.get(cookie) ?? false;
  }
  return false;
}
