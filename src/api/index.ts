import { createAccountsAPI } from './accounts';
import { createForumAPI } from './forum';
import { createFriendsAPI } from './friends';
import { createFilesAPI } from './files';
import { createAPICore } from './utils';

export const createAPI = (cookie?: string) => {
  const apicore = createAPICore(cookie);

  return {
    ...createAccountsAPI(apicore),
    ...createForumAPI(apicore),
    ...createFriendsAPI(apicore),
    ...createFilesAPI(apicore),
  };
};

export type API = ReturnType<typeof createAPI>;
