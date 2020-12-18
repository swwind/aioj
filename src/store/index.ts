import { Router } from 'vue-router';
import { ActionContext, createStore, Store } from 'vuex';
import createActions, { RootActions } from './actions';
import modules, { ModuleMutations as RootMutations, ModuleState as RootState } from './modules';

const store = (router: Router) => createStore<RootState>({
  modules,
  actions: createActions(router),
});

type OptionalSpread<T> = T extends undefined ? [] : [T];

export type ArgumentedActionContext<S = RootState> =
  Omit<ActionContext<S, RootState>, 'commit' | 'dispatch' | 'state' | 'rootState'> & {
    commit<K extends keyof RootMutations>(
      type: K,
      ...payload: OptionalSpread<Parameters<RootMutations[K]>[1]>
    ): ReturnType<RootMutations[K]>;
    dispatch<K extends keyof RootActions>(
      type: K,
      ...payload: OptionalSpread<Parameters<RootActions[K]>[1]>
    ): ReturnType<RootActions[K]>;
    state: S;
    rootState: RootState;
  }

export type MyStore =
  Omit<Store<RootState>, 'commit' | 'dispatch'> & {
    commit<K extends keyof RootMutations>(
      type: K,
      ...payload: OptionalSpread<Parameters<RootMutations[K]>[1]>
    ): ReturnType<RootMutations[K]>;
    dispatch<K extends keyof RootActions>(
      type: K,
      ...payload: OptionalSpread<Parameters<RootActions[K]>[1]>
    ): ReturnType<RootActions[K]>;
  }

export type { RootState };
export default store;
