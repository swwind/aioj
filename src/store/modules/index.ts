import accounts, {
  State as AccountState,
  Mutations as AccountMutations,
  Actions as AccountActions,
} from './accounts';
import i18n, {
  State as I18nState,
  Mutations as I18nMutations,
  Actions as I18nActions,
} from './i18n';
import data, {
  State as DataState,
  Mutations as DataMutations,
  Actions as DataActions,
} from './data';
import ssr, {
  State as SSRState,
  Mutations as SSRMutations,
  Actions as SSRActions,
} from './ssr';

export default {
  accounts,
  i18n,
  data,
  ssr,
};

export type ModuleState = {
  accounts: AccountState,
  i18n: I18nState,
  data: DataState,
  ssr: SSRState,
};

export type ModuleMutations = AccountMutations & DataMutations & I18nMutations & SSRMutations;
export type ModuleActions = AccountActions & DataActions & I18nActions & SSRActions;
