import accounts, { State as AccountState } from './accounts';
import forums, { State as ForumState } from './forums';

export default {
  accounts,
  forums,
};

export type State = {
  accounts: AccountState,
  forums: ForumState,
};
