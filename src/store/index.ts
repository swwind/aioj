import { createStore } from 'vuex';
import modules, { State } from './modules';

const store = createStore<State>({
  modules,
});

export default store;
export { State } from './modules';
