import { INTERNAL_SERVER_ERROR } from '../../app/errors';
import axios, { AxiosResponse, Method } from 'axios';
import config from '../../config.json';

const getNodeURL = () => {
  return config.port === 443
    ? `${config.host}/api`
    : `http://localhost:${config.port}/api`;
};

const getBrowserURL = () => {
  if (typeof (window as any).__VUE_HMR_RUNTIME__ === 'undefined') {
    return '/api';
  } else {
    return `http://localhost:${config.port}/api`;
  }
};

export const request = axios.create({
  baseURL: typeof global.window === 'undefined'
    ? getNodeURL() : getBrowserURL(),
  validateStatus() { return true; },
});

export type APIResponse = {
  status: number;
  error: string;
}

let mockingCookie = '';
export const setMockingCookie = (cookie: string) => {
  mockingCookie = cookie;
};

export const makeRequest = async <T = {}> (response: Promise<AxiosResponse>): Promise<APIResponse & T> => {
  try {
    const res = await response;
    if (typeof res.data === 'object') {
      return res.data;
    }
    return {
      status: res.status,
      error: INTERNAL_SERVER_ERROR,
    } as any;
  } catch (e) {
    return {
      status: 500,
      error: INTERNAL_SERVER_ERROR,
    } as any;
  }
};

export const makeJSONRequest = (method: Method) => <T = {}> (url: string, data?: object, headers?: object) => {
  return makeRequest<T>(request.request({
    url,
    method,
    data: data ? JSON.stringify(data) : '',
    headers: {
      ...(data && { 'Content-Type': 'application/json' }),
      ...headers,
      ...(mockingCookie && { Cookie: mockingCookie }),
    },
  }));
};

export const makeMultipartRequest = <T = {}> (url: string, formdata: FormData, onUploadProgress: (progressEvent: any) => void) => {
  return makeRequest<T>(request.request({
    method: 'post',
    url,
    data: formdata,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  }));
};

export const makeGETRequest = makeJSONRequest('GET');
export const makePOSTRequest = makeJSONRequest('POST');
export const makePUTRequest = makeJSONRequest('PUT');
export const makeDELETERequest = makeJSONRequest('DELETE');
