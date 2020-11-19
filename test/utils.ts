import { expect } from "chai";
import axios, { Method } from 'axios';

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
export const post = jsonRequest('post');
export const get = jsonRequest('get');
export const put = jsonRequest('put');
export const DELETE = jsonRequest('delete');

export const generateFakeAccount = () => {
  return {
    username: 'Attack_' + Math.random().toString(36).slice(2),
    password: Math.random().toString(36).slice(2),
  }
}
