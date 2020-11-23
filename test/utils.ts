import axios, { Method } from 'axios';
import crypto from 'crypto';

const PREFIX = 'http://localhost:8080';

export const jsonRequest = (method: Method) => async (url: string, data?: Object, headers?: Object) => {
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
export const POST = jsonRequest('post');
export const GET = jsonRequest('get');
export const PUT = jsonRequest('put');
export const DELETE = jsonRequest('delete');

export const randomBytes = (n: number) => crypto.randomBytes(n).toString('hex');

export const generateFakeAccount = () => {
  return {
    username: 'Attack_' + randomBytes(16),
    password: randomBytes(16),
  }
}

export const parseCookie = (headers: Headers) => {
  return headers['set-cookie'][0].split(';')[0];
}
