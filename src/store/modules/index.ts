import accounts, { State as AccountState } from './accounts';
import i18n, { State as I18nState } from './i18n';
import data, { State as DataState } from './data';
import ssr, { State as SSRState } from './ssr';

export default {
  accounts,
  i18n,
  data,
  ssr,
};

export type StoreState = {
  accounts: AccountState,
  i18n: I18nState,
  data: DataState,
  ssr: SSRState,
};
