import { UserDetail } from '../../app/types';
import md5 from 'blueimp-md5';
import { APICore } from './utils';

export function passwordHash(psw: string) {
  return md5(`%%% Attack204 AK ICPC World Final ${psw} flag on server is located at /flag`);
}

export const createAccountsAPI = (api: APICore) => {
  const { makePOSTRequest, makeGETRequest } = api;

  return {
    loginAttempt(username: string, password: string) {
      return makePOSTRequest<{ user: UserDetail }>('/login', {
        username,
        password: passwordHash(password),
      });
    },

    registerAttempt(username: string, password: string) {
      return makePOSTRequest<{ user: UserDetail }>('/register', {
        username,
        password: passwordHash(password),
      });
    },

    whoami() {
      return makeGETRequest<{ user: UserDetail }>('/whoami');
    },

    getUserDetail(username: string) {
      return makeGETRequest<{ user: UserDetail }>(`/u/${username}`);
    },

    logoutAttempt() {
      return makePOSTRequest('/logout');
    },
  };
};
