import * as AccountsAPI from './accounts';
import * as ForumAPI from './forum';
import * as FriendsAPI from './friends';

export const API = {
  ...AccountsAPI,
  ...ForumAPI,
  ...FriendsAPI,
}

export {
  synclock,
  unlock,
} from './utils'
