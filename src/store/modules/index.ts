import accounts, { State as AccountState } from './accounts';
import i18n, { State as I18nState } from './i18n';
import data, { State as DataState } from './data';

export default {
  accounts,
  i18n,
  data,
};

export type StoreState = {
  accounts: AccountState,
  i18n: I18nState,
  data: DataState,
};
