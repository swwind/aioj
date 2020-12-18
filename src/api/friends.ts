import { APICore } from './utils';

export const createFriendsAPI = (api: APICore) => {
  const { makeDELETERequest, makeGETRequest, makePUTRequest } = api;
  
  return {

    getFriends(username: string) {
      return makeGETRequest<{ friends: string[] }>(`/friends/${username}`);
    },
    getMyFriends() {
      return makeGETRequest<{ friends: string[] }>('/friends');
    },
    
    addFriend(username: string) {
      return makePUTRequest(`/friends/${username}`);
    },
    
    removeFriend(username: string) {
      return makeDELETERequest(`/friends/${username}`);
    },
  }
}
