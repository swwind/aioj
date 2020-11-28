import accounts, { State as AccountState } from './accounts';
import i18n, { State as I18nState } from './i18n';

export default {
  accounts,
  i18n,
};

export type State = {
  accounts: AccountState,
  i18n: I18nState,
};
