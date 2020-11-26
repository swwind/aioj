import { INTERNAL_SERVER_ERROR } from 'app/errors';
import axios, { Method } from 'axios';

export const request = axios.create({
  baseURL: '/api',
  validateStatus () { return true; },
});

export type APIResponse = {
  status: number;
  error: string;
  [key: string]: any;
}

export const makeJSONRequest = (method: Method) => async (url: string, data: object, headers?: object): Promise<APIResponse> => {
  const res = await request.request({
    url,
    method,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  if (typeof res.data === 'object') {
    return res.data;
  }
  return {
    status: res.status,
    error: INTERNAL_SERVER_ERROR,
  };
};

export const makeGETRequest = makeJSONRequest('GET');
export const makePOSTRequest = makeJSONRequest('POST');
export const makePUTRequest = makeJSONRequest('PUT');
export const makeDELETERequest = makeJSONRequest('DELETE');
