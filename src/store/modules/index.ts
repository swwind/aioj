import {
  State as AccountState,
  Mutations as AccountMutations,
  Actions as AccountActions,
  createAccountsModule,
} from './accounts';
import {
  State as I18nState,
  Mutations as I18nMutations,
  Actions as I18nActions,
  createI18nModule,
} from './i18n';
import {
  State as DataState,
  Mutations as DataMutations,
  Actions as DataActions,
  createDataModule,
} from './data';
import {
  State as SSRState,
  Mutations as SSRMutations,
  Actions as SSRActions,
  createSSRModule,
} from './ssr';
import { API } from '@/api';

export const createModules = (api: API) => {
  return {
    accounts: createAccountsModule(api),
    data: createDataModule(api),
    i18n: createI18nModule(api),
    ssr: createSSRModule(api),
  }
}

export type ModuleState = {
  accounts: AccountState,
  i18n: I18nState,
  data: DataState,
  ssr: SSRState,
};

export type ModuleMutations = AccountMutations & DataMutations & I18nMutations & SSRMutations;
export type ModuleActions = AccountActions & DataActions & I18nActions & SSRActions;
