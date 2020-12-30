import { createAccountsAPI } from './accounts';
import { createForumAPI } from './forum';
import { createFriendsAPI } from './friends';
import { createFilesAPI } from './files';
import { createAPICore } from './utils';
import { createProblemAPI } from './problems';

export const createAPI = (cookie?: string) => {
  const apicore = createAPICore(cookie);

  return {
    ...createAccountsAPI(apicore),
    ...createForumAPI(apicore),
    ...createFriendsAPI(apicore),
    ...createFilesAPI(apicore),
    ...createProblemAPI(apicore),
    ...apicore,
  };
};

export type API = ReturnType<typeof createAPI>;
