import * as AccountsAPI from './accounts';
import * as ForumAPI from './forum';
import * as FriendsAPI from './friends';
import * as FilesAPI from './files';

export const API = {
  ...AccountsAPI,
  ...ForumAPI,
  ...FriendsAPI,
  ...FilesAPI,
};

export { setMockingCookie } from './utils';
