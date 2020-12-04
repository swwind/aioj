import { makeDELETERequest, makeGETRequest, makePUTRequest } from './utils';

export const getFriends = async (username: string) => {
  return await makeGETRequest<{ friends: string[] }>(`/friends/${username}`);
};
export const getMyFriends = async () => {
  return await makeGETRequest<{ friends: string[] }>('/friends');
};

export const addFriend = async (username: string) => {
  return await makePUTRequest(`/friends/${username}`);
};

export const removeFriend = async (username: string) => {
  return await makeDELETERequest(`/friends/${username}`);
};
