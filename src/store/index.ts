import { API } from '@/api';
import { Router } from 'vue-router';
import { ActionContext, createStore as createVuexStore, Store } from 'vuex';
import createActions, { RootActions } from './actions';
import { createModules, ModuleMutations as RootMutations, ModuleState } from './modules';

export type RootState = ModuleState;

export const createStore = (router: Router, api: API) => createVuexStore<RootState>({
  modules: createModules(api),
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
