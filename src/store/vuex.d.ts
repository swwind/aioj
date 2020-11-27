// vuex.d.ts
import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex'
import { State } from './modules';
import { Notification } from 'element-plus';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>;
    $notify: typeof Notification;
  }
}