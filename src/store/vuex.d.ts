// vuex.d.ts
import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex'
import { State } from './modules';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}