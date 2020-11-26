import accounts, { State as AccountState } from './accounts';

export default {
  accounts,
};

export type State = {
  accounts: AccountState,
};
