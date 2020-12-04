import { UserDetail } from '../../app/types';
import md5 from 'md5';
import { makeGETRequest, makePOSTRequest } from './utils';

export function passwordHash(psw: string) {
  return md5(`attack_ak_world_final_round_${psw}`);
}

export async function loginAttempt(username: string, password: string) {
  return await makePOSTRequest<{ user: UserDetail }>('/login', {
    username,
    password: passwordHash(password),
  });
}

export async function registerAttempt(username: string, password: string) {
  return await makePOSTRequest<{ user: UserDetail }>('/register', {
    username,
    password: passwordHash(password),
  });
}
export async function whoami() {
  return await makeGETRequest<{ user: UserDetail }>('/whoami');
}

export async function getUserDetail(username: string) {
  return await makeGETRequest<{ user: UserDetail }>(`/u/${username}`);
}
