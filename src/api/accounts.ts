import { UserDetail } from 'app/db';
import axios from 'axios';
import md5 from 'md5';
import { makeGETRequest, makePOSTRequest } from './utils';

axios.defaults.baseURL = '/api';

export function passwordHash(psw: string) {
  return md5(`attack_ak_world_final_round_${psw}`);
}

export async function loginAttempt(username: string, password: string) {
  return await makePOSTRequest<UserDetail>('/login', {
    username,
    password: passwordHash(password),
  });
}

export async function registerAttempt(username: string, password: string) {
  return await makePOSTRequest<UserDetail>('/register', {
    username,
    password: passwordHash(password),
  });
}
export async function whoami() {
  return await makeGETRequest<UserDetail>('/whoami');
}

export async function getUserDetail(username: string) {
  return await makeGETRequest<UserDetail>(`/u/${username}`);
}
