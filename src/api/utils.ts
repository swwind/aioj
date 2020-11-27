import { INTERNAL_SERVER_ERROR } from 'app/errors';
import axios, { Method } from 'axios';
import config from '../../config.json';

const getBaseURL = () => {
  return config.port === 443
    ? 'https://localhost/api'
    : `http://localhost:${config.port}/api`;
};

export const request = axios.create({
  baseURL: typeof global.window === 'undefined'
    ? getBaseURL() : '/api',
  validateStatus() { return true; },
});

export type APIResponse = {
  status: number;
  error: string;
}

export const makeJSONRequest = (method: Method) => async <T = {}> (url: string, data?: object, headers?: object): Promise<APIResponse & T> => {
  const res = await request.request({
    url,
    method,
    data: data ? JSON.stringify(data) : '',
    headers: {
      ...(data && { 'Content-Type': 'application/json' }),
      ...headers,
    },
  });
  if (typeof res.data === 'object') {
    return res.data;
  }
  return {
    status: res.status,
    error: INTERNAL_SERVER_ERROR,
  } as any;
};

export const makeGETRequest = makeJSONRequest('GET');
export const makePOSTRequest = makeJSONRequest('POST');
export const makePUTRequest = makeJSONRequest('PUT');
export const makeDELETERequest = makeJSONRequest('DELETE');
