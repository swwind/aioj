import { INTERNAL_SERVER_ERROR } from '../../app/errors';
import axios, { AxiosResponse, Method } from 'axios';
import config from '../../config.json';

const getNodeURL = () => {
  return config.port === 443
    ? `${config.host}/api`
    : `http://localhost:${config.port}/api`;
};

const getBrowserURL = () => {
  if ('__VUE_HMR_RUNTIME__' in window) {
    // debugging
    return `http://localhost:${config.port}/api`;
  } else {
    // production
    return '/api';
  }
};

export type APIResponse = {
  status: number;
  error: string;
}

export const createAPICore = (cookie?: string) => {
  const request = axios.create({
    baseURL: typeof window === 'undefined'
      ? getNodeURL() : getBrowserURL(),
    validateStatus() { return true; },
    headers: cookie ? { Cookie: cookie } : { },
  });

  const makeRequest = async <T = {}> (response: Promise<AxiosResponse>): Promise<APIResponse & T> => {
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

  const makeJSONRequest = (method: Method) => <T = {}> (url: string, data?: object, headers?: object) => {
    return makeRequest<T>(request.request({
      url,
      method,
      data: data ? JSON.stringify(data) : '',
      headers: {
        ...(data && { 'Content-Type': 'application/json' }),
        ...headers,
      },
    }));
  };

  const makeMultipartRequest = <T = {}> (url: string, formdata: FormData, onUploadProgress: (progressEvent: any) => void) => {
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

  return {
    makeGETRequest: makeJSONRequest('GET'),
    makePOSTRequest: makeJSONRequest('POST'),
    makePUTRequest: makeJSONRequest('PUT'),
    makeDELETERequest: makeJSONRequest('DELETE'),
    makeMultipartRequest,
    makeJSONRequest,
  };
};

export type APICore = ReturnType<typeof createAPICore>;
